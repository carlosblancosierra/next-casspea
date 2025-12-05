import React, { useState, useMemo, useEffect } from 'react';
import { addDays, format, isWeekend, startOfDay } from 'date-fns';
import { enGB } from 'date-fns/locale';

// Helper to get London time (GMT/BST)
function getLondonNow() {
  const now = new Date();
  // Convert to London time (Europe/London)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // London is either UTC+0 or UTC+1 depending on DST
  // This is a simple approximation; for production use a timezone lib
  const offset = (new Date().getTimezoneOffset() === 0 ? 0 : 1); // crude DST check
  return new Date(utc + 3600000 * offset);
}

const SLOT_START = 10; // 10:00
const SLOT_END = 16;   // 16:00

function getTimeSlots(forToday = false) {
  const slots = [];
  for (let h = SLOT_START; h < SLOT_END; h++) {
    slots.push({
      start: `${String(h).padStart(2, '0')}:00`,
      end: `${String(h).padStart(2, '0')}:30`,
      value: `${String(h).padStart(2, '0')}:00-${String(h).padStart(2, '0')}:30`,
    });
    slots.push({
      start: `${String(h).padStart(2, '0')}:30`,
      end: `${String(h+1).padStart(2, '0')}:00`,
      value: `${String(h).padStart(2, '0')}:30-${String(h+1).padStart(2, '0')}:00`,
    });
  }
  if (forToday) {
    // Only show last slot for today before noon
    return [slots[slots.length - 1]];
  }
  return slots;
}

function getNextWeekdays(startDate: Date, count = 14) {
  // Returns up to 'count' weekdays from startDate
  const days: Date[] = [];
  let d = startOfDay(startDate);
  while (days.length < count) {
    if (!isWeekend(d)) days.push(new Date(d));
    d = addDays(d, 1);
  }
  return days;
}

type Slot = { start: string; end: string; value: string };

type CheckoutStorePickUpProps = {
  onChange?: (val: { date: Date; slot: Slot } | null) => void;
};

const CheckoutStorePickUp: React.FC<CheckoutStorePickUpProps> = ({ onChange }) => {
  const now = getLondonNow();
  const isBeforeNoon = now.getHours() < 12;

  // If before noon, today is allowed, else only from tomorrow
  const minDate = isBeforeNoon ? now : addDays(now, 1);
  const availableDays = useMemo(() => getNextWeekdays(minDate, 14), [minDate]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Only show last slot if today is picked and before noon
  const slots = useMemo(() => {
    if (!selectedDate) return [];
    const picked = format(selectedDate, 'yyyy-MM-dd');
    const today = format(now, 'yyyy-MM-dd');
    if (picked === today && isBeforeNoon) {
      return getTimeSlots(true);
    }
    return getTimeSlots(false);
  }, [selectedDate, now, isBeforeNoon]);

  // Notify parent when selection changes (null if incomplete)
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      const slot = slots.find(s => s.value === selectedSlot);
      if (slot && onChange) {
        onChange({ date: selectedDate, slot });
      }
    } else if (onChange) {
      // If either is missing, notify parent that selection is incomplete
      onChange(null);
    }
  }, [selectedDate, selectedSlot, slots, onChange]);

  // Calendar UI: collapsible date selection
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text-light">
          {selectedDate ? 'Selected Pickup Date' : 'Select Pickup Date'}
        </h3>

        {selectedDate ? (
          // Show selected date with option to change
          <div className="flex items-center justify-between p-3 bg-main-bg dark:bg-main-bg-dark rounded border">
            <span className="text-primary-text font-medium">
              {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: enGB })}
            </span>
            <button
              type="button"
              onClick={() => { setSelectedDate(null); setSelectedSlot(null); }}
              className="text-primary text-sm hover:text-primary/80 underline"
            >
              Change Date
            </button>
          </div>
        ) : (
          // Show date selection grid
          <div className="grid grid-cols-3 gap-2">
            {availableDays.map(day => {
              const dayStr = format(day, 'EEE dd MMM', { locale: enGB });
              return (
                <button
                  key={dayStr}
                  type="button"
                  className="px-2 py-3 rounded border bg-main-bg dark:bg-main-bg-dark text-primary-text hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                >
                  {dayStr}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDate && (
        <>
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-primary-text dark:text-primary-text-light">Select Time Slot</h4>
            <div className="grid grid-cols-2 gap-2">
              {slots.map(slot => (
                <button
                  key={slot.value}
                  type="button"
                  className={`px-2 py-3 rounded border transition-colors ${
                    selectedSlot === slot.value
                      ? 'bg-primary text-primary-text-light border-primary'
                      : 'bg-main-bg dark:bg-main-bg-dark text-primary-text hover:bg-primary/10 hover:border-primary'
                  }`}
                  onClick={() => { setSelectedSlot(slot.value); }}
                >
                  {slot.start} - {slot.end}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutStorePickUp;
