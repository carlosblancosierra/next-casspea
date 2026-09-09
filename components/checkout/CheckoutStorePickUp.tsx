import React, { useState, useMemo, useEffect } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { getLondonNow, getNextShippingDays } from '@/utils/shippingDays';

const SLOT_START = 10; // 10:00
const SLOT_END = 16;   // 16:00
const SAME_DAY_CUTOFF_HOUR = 12;

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
    // Same-day orders still need making up, so only the closing slot is offered.
    return [slots[slots.length - 1]];
  }
  return slots;
}

type Slot = { start: string; end: string; value: string };

type CheckoutStorePickUpProps = {
  onChange?: (val: { date: Date; slot: Slot } | null) => void;
};

const CheckoutStorePickUp: React.FC<CheckoutStorePickUpProps> = ({ onChange }) => {
  const { date: londonToday, hour: londonHour } = useMemo(() => getLondonNow(), []);
  const isBeforeCutoff = londonHour < SAME_DAY_CUTOFF_HOUR;

  // Same-day collection only while there is still time to make the order up.
  const minDate = isBeforeCutoff ? londonToday : addDays(londonToday, 1);
  const availableDays = useMemo(() => getNextShippingDays(minDate, 14), [minDate]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const isToday = selectedDate ? isSameDay(selectedDate, londonToday) : false;
  const isSameDayPickup = isToday && isBeforeCutoff;

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return getTimeSlots(isSameDayPickup);
  }, [selectedDate, isSameDayPickup]);

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

  const dayLabel = (day: Date) => {
    if (isSameDay(day, londonToday)) return 'Today';
    if (isSameDay(day, addDays(londonToday, 1))) return 'Tomorrow';
    return format(day, 'EEE', { locale: enGB });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-primary-text dark:text-primary-text-light">
          Pick a day
        </h3>

        {/* A scrolling strip rather than a wall of dates, and it never
            collapses — changing your mind is one tap, not a "Change date"
            round trip. */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {availableDays.map(day => {
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-pressed={isSelected}
                onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                className={`flex-shrink-0 snap-start w-24 px-3 py-2 rounded-lg border text-center transition-colors ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-text-light'
                    : 'bg-main-bg dark:bg-main-bg-dark border-gray-200 dark:border-gray-700 text-primary-text dark:text-primary-text-light hover:border-primary dark:hover:border-primary-2'
                }`}
              >
                <span className="block text-sm font-medium">{dayLabel(day)}</span>
                <span className={`block text-xs ${isSelected ? 'text-primary-text-light/80' : 'text-primary-text/70 dark:text-primary-text-light/70'}`}>
                  {format(day, 'd MMM', { locale: enGB })}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-primary-text/70 dark:text-primary-text-light/70">
          Collection from 104 Bedford Hill, London, SW12 9HR. Weekdays only.
        </p>
      </div>

      {selectedDate && (
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-primary-text dark:text-primary-text-light">
            Pick a time
            <span className="ml-2 font-normal text-sm text-primary-text/70 dark:text-primary-text-light/70">
              {format(selectedDate, 'EEEE d MMMM', { locale: enGB })}
            </span>
          </h3>

          {/* Otherwise a single slot for today looks like a bug. */}
          {isSameDayPickup && (
            <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
              Same-day collection is available for the last slot only, so we have time to make your order up.
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map(slot => (
              <button
                key={slot.value}
                type="button"
                aria-pressed={selectedSlot === slot.value}
                onClick={() => { setSelectedSlot(slot.value); }}
                className={`px-2 py-3 rounded-lg border text-sm transition-colors ${
                  selectedSlot === slot.value
                    ? 'bg-primary text-primary-text-light border-primary'
                    : 'bg-main-bg dark:bg-main-bg-dark border-gray-200 dark:border-gray-700 text-primary-text dark:text-primary-text-light hover:border-primary dark:hover:border-primary-2'
                }`}
              >
                {slot.start}–{slot.end}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutStorePickUp;
