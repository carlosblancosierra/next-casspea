import React, { useState, useMemo, useEffect } from 'react';
import { addDays, format, isSameDay } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { getLondonNow, getNextShippingDays } from '@/utils/shippingDays';

type Slot = { start: string; end: string; value: string };

const SLOT_START = 10; // 10:00
const SLOT_END = 16;   // 16:00
const SAME_DAY_CUTOFF_HOUR = 12;

function getTimeSlots() {
  const slots: Slot[] = [];
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
  return slots;
}

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

  const slots = useMemo(() => (selectedDate ? getTimeSlots() : []), [selectedDate]);

  /**
   * Same-day orders still have to be made up, so only the closing slot is
   * collectable. The earlier ones used to be filtered out of the list, which
   * left today showing a single slot with no clue why — it read as broken.
   * They are shown and disabled instead, with the reason next to them.
   */
  const isSlotBlocked = (slot: Slot) =>
    isSameDayPickup && slot.value !== slots[slots.length - 1]?.value;

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

          {isSameDayPickup && (
            <p className="text-sm text-primary-text/70 dark:text-primary-text-light/70">
              Collecting today? We need until the end of the day to make your order up,
              so the earlier slots are closed — the last one is yours.
            </p>
          )}

          {/* The same scrolling strip as the days above, so both halves of the
              question look like the same question. Only the start time is
              shown — "10:00–10:30" is more precision than the choice needs,
              and it doubles the width of every chip. The slot still carries
              its end time, because that is what the order records.

              Blocked slots stay on screen: hiding them left today showing one
              lone slot with no explanation, which read as a bug rather than a
              rule. */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {slots.map(slot => {
              const blocked = isSlotBlocked(slot);
              const isSelected = selectedSlot === slot.value;
              return (
                <button
                  key={slot.value}
                  type="button"
                  disabled={blocked}
                  title={blocked ? 'Too soon for today — we need time to make your order up' : undefined}
                  aria-pressed={isSelected}
                  onClick={() => { setSelectedSlot(slot.value); }}
                  className={`flex-shrink-0 snap-start px-3 py-3 rounded-lg border text-sm whitespace-nowrap transition-colors ${
                    blocked
                      ? 'border-gray-200 dark:border-gray-700 text-primary-text/40 dark:text-primary-text-light/40 line-through cursor-not-allowed'
                      : isSelected
                      ? 'bg-primary text-primary-text-light border-primary'
                      : 'bg-main-bg dark:bg-main-bg-dark border-gray-200 dark:border-gray-700 text-primary-text dark:text-primary-text-light hover:border-primary dark:hover:border-primary-2'
                  }`}
                >
                  {slot.start}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutStorePickUp;
