'use client'
import React, { useState, useEffect } from 'react'
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice'
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice'
import SelectableProductCard from '@/components/store/SelectableProductCard'
import SelectableGiftCard from '@/components/store/SelectableGiftCard'
import AllergenSelection from '@/components/product_detail/AllergenSelection'
import FlavourPicker from '@/components/product_detail/FlavourPicker'
import GiftMessage from '@/components/cart/GiftMessage'
import Spinner from '@/components/common/Spinner'
import BoxSelection from '@/components/product_detail/BoxSelection'
import { Product } from '@/types/products'
import { Flavour as FlavourType } from '@/types/flavours'
import { CartItemBoxFlavorSelection } from '@/types/carts'
import { useRouter } from 'next/navigation'
// Get the price from the product with the units_per_box.
const PRICE_MAP: Record<number, number> = { 9: 28, 15: 38, 24: 53, 48: 90 }

const ID_MAP: Record<number, number> = { 9: 170, 15: 171, 24: 172, 48: 173 }

const ALLERGENS = [
  { id: 2, name: 'Gluten'  },
  { id: 5, name: 'Alcohol' },
  { id: 6, name: 'Nut'     },
]

const PREBUILDS = [
  { name: 'Pick & Mix',  value: 'PICK_AND_MIX', description: 'Choose your own flavours' },
  { name: 'Surprise Me', value: 'RANDOM',       description: 'Let us surprise you' },
]

const STEP_LABELS = [
  'Signature Box',
  'Chocolate Bark',
  'Hot Chocolate',
  'Gift Card',
  'Box Type',
  'Select Allergens',
  'Choose Flavours',
  'Summary',
]

const STEP_BORDER = [
  'border-pink-500',
  'border-green-500',
  'border-red-500',
  'border-orange-400',
  'border-blue-700',
  'border-yellow-300',
  'border-indigo-500',
  'border-purple-500',
]

export default function OrderPage() {
  const { data: products, isLoading, error } = useGetActiveProductsQuery()
  const [step, setStep] = useState(0)

  // selections
  const [signatureBox,  setSignatureBox]  = useState<Product | null>(null)
  const [chocolateBark, setChocolateBark] = useState<Product | null>(null)
  const [hotChocolate,  setHotChocolate]  = useState<Product | null>(null)
  const [giftCard,      setGiftCard]      = useState<Product | null>(null)
  const [boxType,       setBoxType]       = useState<string>('PICK_AND_MIX')

  // customization
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([])
  const [flavours,           setFlavours]           = useState<CartItemBoxFlavorSelection[]>([])
  const [remaining,         setRemaining]          = useState(0)
  const [giftMessage,       setGiftMessage]       = useState('')
  const [allergenOption,    setAllergenOption]     = useState<'NONE' | 'SPECIFY'>("NONE")

  // price & capacity
  const units    = signatureBox?.units_per_box || 0
  const sigPrice = PRICE_MAP[units] || 0
  
  const router = useRouter();
  const [addCartItem, { isLoading: cartLoading, error: cartError }] = useAddCartItemMutation();

  useEffect(() => {
    if (signatureBox) {
      setRemaining(signatureBox.units_per_box || 0)
      setFlavours([])
    }
  }, [signatureBox])

  // select handler
  const handleSelect = (item: Product) => {
    if (step === 0) {
      setSignatureBox(item)
      setStep(s => s + 1)
    } else if (step === 1) {
      setChocolateBark(item)
      setStep(s => s + 1)
    } else if (step === 2) {
      setHotChocolate(item)
      setStep(s => s + 1)
    } else if (step === 3) {
      setGiftCard(item)
    }
  }

  // flavour handlers
  const addFlavour = (f: FlavourType) => {
    if (remaining === 0) return
    const idx = flavours.findIndex(x => x.flavor.id === f.id)
    if (idx >= 0) {
      const u = [...flavours]; u[idx].quantity++; setFlavours(u)
    } else {
      setFlavours([...flavours, { flavor: f, quantity: 1 }])
    }
    setRemaining(r => r - 1)
  }
  const inc = (i: number) => remaining > 0 && addFlavour(flavours[i].flavor)
  const dec = (i: number) => {
    const u = [...flavours]
    if (u[i].quantity > 1) {
      u[i].quantity--; setFlavours(u); setRemaining(r => r + 1)
    } else {
      const qty = u[i].quantity
      setFlavours(f => f.filter((_,j) => j !== i))
      setRemaining(r => r + qty)
    }
  }
  const clearFlavours = () => {
    setFlavours([]); setRemaining(signatureBox?.units_per_box || 0)
  }

  // final confirm
  const handleConfirm = async () => {
    if (!signatureBox) return;

    // Ensure boxType is non-null, default to 'PICK_AND_MIX'
    const finalBoxType = (boxType ? boxType : 'PICK_AND_MIX') as 'PICK_AND_MIX' | 'RANDOM';

    const productId = signatureBox.units_per_box ? (ID_MAP[signatureBox.units_per_box] || signatureBox.id) : signatureBox.id;

    const payload = {
      product: productId,
      quantity: 1,
      // box_customization: null, // Null for packs
      pack_customization: {
        selection_type: finalBoxType,
        flavor_selections: flavours.map(f => ({
          flavor: f.flavor.id,
          quantity: f.quantity
        })),
        chocolate_bark: chocolateBark ? chocolateBark.id : undefined,
        hot_chocolate: hotChocolate ? hotChocolate.id : undefined,
        gift_card: giftCard ? giftCard.id : undefined,
      }
    };

    try {
      console.log('payload', payload)
      const response = await addCartItem(payload).unwrap();
      router.push('/cart');
      console.log('Added pack to cart', response);
    } catch (error) {
      console.error('Failed to add pack to cart', error);
    }
  }

  if (isLoading) return <Spinner md />
  if (error || !products) return <div>Error loading products</div>

  // summary helper
  const allergenSummary = selectedAllergens.length === 0
    ? 'No Allergens (applies only to bonbons)'
    : `${ALLERGENS.filter(a => selectedAllergens.includes(a.id))
        .map(a => a.name)
        .join(' and ')} (only for bonbons)`

  return (
    <div className="container mx-auto py-8">
      <div className="md:grid md:grid-cols-4 gap-8">

        {/* Desktop steps */}
        <aside className="hidden md:block md:col-span-1">
          <ul className="space-y-2">
            {STEP_LABELS.map((label, i) => (
              <li
                key={i}
                onClick={() => setStep(i)}
                className={`
                  cursor-pointer px-3 py-2 border-l-4 rounded-r
                  ${ step === i
                    ? `${STEP_BORDER[i]}`
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                Step {i+1}: {label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <section className="md:col-span-3 space-y-8">

          {/* Step 1 */}
          {step === 0 && (
            <>
              <h2 className="text-xl font-semibold">
                Step 1: Signature Box
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.filter(p => p.category?.slug === 'signature-boxes')
                  .map(p => (
                    <SelectableProductCard
                      key={p.id}
                      product={p}
                      price={p.units_per_box ? PRICE_MAP[p.units_per_box] : 0}
                      onSelect={() => handleSelect(p)}
                    />
                  ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Your box size determines the price of your pack.
              </p>
            </>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold">Step 2: Chocolate Bark</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.filter(p => p.category?.slug === 'chocolate-barks')
                  .map(p => (
                    <SelectableProductCard
                      key={p.id}
                      product={p}
                      price={0}
                      onSelect={() => handleSelect(p)}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold">Step 3: Hot Chocolate</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.filter(p => p.category?.slug === 'hot-chocolate')
                  .map(p => (
                    <SelectableProductCard
                      key={p.id}
                      product={p}
                      price={0}
                      onSelect={() => handleSelect(p)}
                    />
                  ))}
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold">Step 4: Gift Card</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.filter(p => p.category?.slug === 'gift-cards').map(p => (
                  <SelectableGiftCard
                    key={p.id}
                    title={p.name}
                    image={p.image || ""}
                    selected={giftCard?.id === p.id}
                    onSelect={() => handleSelect(p)}
                  />
                ))}
                <div
                  onClick={() => setGiftCard(null)}
                  className={`flex items-center justify-center p-6 border rounded cursor-pointer
                    ${giftCard === null ? 'border-blue-500' : 'border-gray-300'}`}
                >
                  No Gift Card
                </div>
              </div>
              {giftCard && (
                <div className="mt-4">
                  <GiftMessage onGiftMessageChange={setGiftMessage} />
                </div>
              )}
              <button
                onClick={() => setStep(4)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Next
              </button>
            </>
          )}

          {/* Step 5 */}
          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Step 5: Choose Box Type</h2>
              <BoxSelection
                options={PREBUILDS}
                selected={(boxType ?? 'PICK_AND_MIX') as string}
                onChange={(value: string) => setBoxType(value)}
              />
              <button
                onClick={() => boxType && setStep(5)}
                disabled={!boxType}
                className={`mt-4 px-6 py-2 rounded text-white ${
                  boxType 
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </>
          )}

          {/* Step 6 */}
          {step === 5 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Step 6: Select Allergens</h2>
              <p className="text-sm text-gray-500 mb-4">
                Applies only to bonbons (signature box), not to Chocolate Bark or Hot Chocolate.
              </p>
              <AllergenSelection
                allergens={ALLERGENS}
                selectedAllergens={selectedAllergens}
                setSelectedAllergens={setSelectedAllergens}
                allergenOption={allergenOption}
                setAllergenOption={setAllergenOption as (option: "NONE" | "SPECIFY" | null) => void}
              />
              <button
                onClick={() => setStep(boxType === 'RANDOM' ? 7 : 6)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            </>
          )}

          {/* Step 7 */}
          {step === 6 && signatureBox && boxType === 'PICK_AND_MIX' && (
            <>
              <h2 className="text-xl font-semibold">Step 7: Choose Flavours</h2>
              <FlavourPicker
                flavours={flavours}
                remainingChocolates={remaining}
                maxChocolates={signatureBox.units_per_box || 0}
                handleAddFlavour={addFlavour}
                incrementQuantity={inc}
                decrementQuantity={dec}
                deleteFlavour={(i) => dec(i)}
                handleDeleteAllFlavours={clearFlavours}
                selectedAllergens={selectedAllergens}
                handleFlavourChange={() => {}}
              />
              <button
                onClick={() => setStep(7)}
                disabled={remaining > 0}
                className={`mt-4 px-6 py-2 rounded text-white ${remaining > 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                Next
              </button>
            </>
          )}

          {/* Step 8 */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Step 8: Summary</h2>
              {[
                { label: 'Signature Box',  name: signatureBox?.name,  image: signatureBox?.image, extra: `£${sigPrice}` },
                { label: 'Chocolate Bark', name: chocolateBark?.name, image: chocolateBark?.image },
                { label: 'Hot Chocolate',  name: hotChocolate?.name, image: hotChocolate?.image },
                { label: 'Gift Card',      name: giftCard?.name || 'No Gift Card', image: giftCard?.image },
                { label: 'Allergens',      name: allergenSummary },
                { label: 'Flavours',       name: `${flavours.length} Flavours Selected` },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => setStep(i === 3 ? 3 : i === 4 ? 5 : i)}
                  className="flex items-center space-x-4 p-2 border dark:border-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <span className="font-medium">{item.label}: {item.name || '—'}</span>
                  {item.extra && <span className="ml-auto font-semibold">{item.extra}</span>}
                </div>
              ))}
              <button
                onClick={handleConfirm}
                className="mt-4 px-10 py-4 bg-pink-600 text-white rounded hover:bg-pink-500 float-right"
              >
                Add to Cart
              </button>
            </div>
          )}

        </section>
      </div>
    </div>
  )
}