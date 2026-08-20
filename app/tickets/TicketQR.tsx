"use client";

import { QRCodeSVG } from "qrcode.react";

interface TicketQRProps {
  eventId: string;
  ticketId: string;
}

export default function TicketQR({ eventId, ticketId }: TicketQRProps) {
  const value = JSON.stringify({ event_id: eventId, ticket_id: ticketId });
  return (
    <div className="flex justify-center mt-4">
      <QRCodeSVG
        value={value}
        size={140}
        bgColor="#0f172a"
        fgColor="#ffffff"
        level="M"
      />
    </div>
  );
}
