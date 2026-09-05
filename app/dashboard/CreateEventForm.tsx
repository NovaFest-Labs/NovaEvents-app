"use client";

import { useState } from "react";
import { useCreateEvent, type CreateEventTierInput } from "../hooks/useCreateEvent";

const EMPTY_TIER: CreateEventTierInput = { name: "", price: "", supplyCap: "" };

interface CreateEventFormProps {
  organizerAddress: string;
  onCreated?: () => void;
}

export default function CreateEventForm({
  organizerAddress,
  onCreated,
}: CreateEventFormProps) {
  const { createEvent, status, error, reset } = useCreateEvent(organizerAddress);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [tiers, setTiers] = useState<CreateEventTierInput[]>([{ ...EMPTY_TIER }]);
  const [validationError, setValidationError] = useState<string | null>(null);

  function updateTier(index: number, field: keyof CreateEventTierInput, value: string) {
    setTiers((prev) =>
      prev.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    );
  }

  function addTier() {
    setTiers((prev) => [...prev, { ...EMPTY_TIER }]);
  }

  function removeTier(index: number) {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }

  function validate(): string | null {
    if (!name.trim()) return "Event name is required.";
    if (!description.trim()) return "Description is required.";
    if (!venue.trim()) return "Venue is required.";
    if (!date) return "Date is required.";
    if (!fundingGoal || Number(fundingGoal) <= 0) return "Funding goal must be greater than 0.";
    if (tiers.length === 0) return "Add at least one ticket tier.";
    for (const tier of tiers) {
      if (!tier.name.trim() || !tier.price || !tier.supplyCap) {
        return "Every ticket tier needs a name, price, and supply cap.";
      }
      if (Number(tier.price) <= 0) return "Tier price must be greater than 0.";
      if (Number(tier.supplyCap) <= 0) return "Tier supply cap must be greater than 0.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    const validationMessage = validate();
    setValidationError(validationMessage);
    if (validationMessage) return;

    await createEvent({ name, description, venue, date, fundingGoal, tiers });
    onCreated?.();
  }

  const pending = status === "pending";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="create-event-name" className="text-sm text-slate-400">
            Event name
          </label>
          <input
            id="create-event-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create-event-venue" className="text-sm text-slate-400">
            Venue
          </label>
          <input
            id="create-event-venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="create-event-description" className="text-sm text-slate-400">
            Description
          </label>
          <textarea
            id="create-event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create-event-date" className="text-sm text-slate-400">
            Date
          </label>
          <input
            id="create-event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="create-event-funding-goal" className="text-sm text-slate-400">
            Funding goal (USDC)
          </label>
          <input
            id="create-event-funding-goal"
            type="number"
            min="0"
            step="0.0000001"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Ticket tiers</h3>
        <div className="space-y-3">
          {tiers.map((tier, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label htmlFor={`tier-name-${i}`} className="text-xs text-slate-500">
                  Tier name
                </label>
                <input
                  id={`tier-name-${i}`}
                  value={tier.name}
                  onChange={(e) => updateTier(i, "name", e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`tier-price-${i}`} className="text-xs text-slate-500">
                  Price (USDC)
                </label>
                <input
                  id={`tier-price-${i}`}
                  type="number"
                  min="0"
                  step="0.0000001"
                  value={tier.price}
                  onChange={(e) => updateTier(i, "price", e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor={`tier-supply-${i}`} className="text-xs text-slate-500">
                  Supply cap
                </label>
                <input
                  id={`tier-supply-${i}`}
                  type="number"
                  min="1"
                  step="1"
                  value={tier.supplyCap}
                  onChange={(e) => updateTier(i, "supplyCap", e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTier(i)}
                disabled={tiers.length === 1}
                aria-label={`Remove tier ${i + 1}`}
                className="text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed text-sm px-2 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addTier}
          className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          + Add tier
        </button>
      </div>

      {validationError && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {validationError}
        </p>
      )}

      {!validationError && status === "error" && error && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {status === "success" && (
        <p role="status" className="mt-4 text-sm text-green-400">
          Event created successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        {pending ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
