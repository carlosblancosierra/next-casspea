'use client'
import React, { useState, useEffect } from 'react'
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice'
import { useAddCartItemMutation, useUpdateCartMutation } from '@/redux/features/carts/cartApiSlice'
import StepSidebar from './StepSidebar'
import {
  SignatureBoxStep,
  ChocolateBarkStep,
  HotChocolateStep,
  GiftCardStep,
  BoxTypeStep,
  AllergenStep,
  FlavourStep,
  SummaryStep
} from '@/components/packs/steps'

import { PRICE_MAP, ID_MAP, ALLERGENS, PREBUILDS, STEP_LABELS, STEP_BORDER, STEP_EXPLANATIONS } from '@/components/packs/constants'
import { useRouter } from 'next/navigation'
import Spinner from "@/components/common/Spinner";
import { Product } from '@/types/products';
import { CartItemBoxFlavorSelection } from '@/types/carts';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';

export default function PackBuilder() {
  const { data: products, isLoading, error } = useGetActiveProductsQuery()
  const { data: allFlavours, isLoading: isFlavoursLoading, error: flavourError } = useGetFlavoursQuery();
  const [addCartItem, { isLoading: cartLoading }] = useAddCartItemMutation()
  const [updateCart] = useUpdateCartMutation()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [signatureBox, setSignatureBox] = useState<Product | null>(null)
  const [chocolateBark, setChocolateBark] = useState<Product | null>(null)
  const [hotChocolate, setHotChocolate] = useState<Product | null>(null)
  const [giftCard, setGiftCard] = useState<Product | null>(null)
  const [boxType, setBoxType] = useState<'PICK_AND_MIX' | 'RANDOM'>('PICK_AND_MIX')
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([])
  const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>([])
  const [remaining, setRemaining] = useState(0)
  const [giftMessage, setGiftMessage] = useState('')
  const [allergenOption, setAllergenOption] = useState<'NONE' | 'SPECIFY' | null>(null)

  useEffect(() => {
    if (signatureBox) {
      setRemaining(signatureBox.units_per_box ?? 0)
      setFlavours([])
    }
  }, [signatureBox])

  // Updated handleAddFlavour to use FlavourType
  const handleAddFlavour = (flavour) => {
    if (remaining === 0) return;
    const idx = flavours.findIndex(x => x.flavor.id === flavour.id);
    if (idx >= 0) {
      const u = [...flavours]; u[idx].quantity++; setFlavours(u)
    } else {
      setFlavours([
        ...flavours,
        { flavor: flavour, quantity: 1 }
      ])
    }
    setRemaining(r => r - 1)
  }
  const handleInc = (i: number) => {
    if (remaining > 0) {
      handleAddFlavour(flavours[i].flavor)
    }
  }
  const handleDec = (i: number): void => {
    const u = [...flavours]
    if (u[i].quantity > 1) {
      u[i].quantity--; setFlavours(u); setRemaining(r => r + 1)
    } else {
      const qty = u[i].quantity
      setFlavours(f => f.filter((_,j) => j !== i))
      setRemaining(r => r + qty)
    }
  }
  const handleClear = (): void => {
    setFlavours([]); setRemaining(signatureBox?.units_per_box ?? 0)
  }

  // Helper: ensure we send the **Flavour** PK, not the Product PK
  const getFlavourPk = (f: any): number => {
    // Prefer canonical flavour FK the API expects if present on product
    // Adjust these fallbacks to your actual product->flavour mapping
    return (
      f.flavour_id ??
      f.flavor_id ??
      f.flavour?.id ??
      f.flavor?.id ??
      f.id // last resort (only if product.id == flavour.id in your DB)
    )
  }

  const handleConfirm = async () => {
    if (!signatureBox) return
    const productId = typeof signatureBox.units_per_box === 'number'
      ? (ID_MAP[signatureBox.units_per_box] || signatureBox.id)
      : signatureBox.id

    const allergensToSend =
      allergenOption === 'SPECIFY' ? selectedAllergens : []

    const payload: any = {
      product: productId,
      quantity: 1,
      pack_customization: {
        selection_type: boxType, // must match choices in your model
        flavor_selections: boxType === 'PICK_AND_MIX'
          ? flavours.map(f => ({
              flavor: getFlavourPk(f.flavor),
              quantity: f.quantity
            }))
          : [],
        chocolate_bark: chocolateBark?.id ?? null,
        hot_chocolate: hotChocolate?.id ?? null,
        gift_card: giftCard?.id ?? null,
        allergens: allergensToSend
      }
    }

    console.log('payload', payload)

    try {
      if (giftMessage.trim() !== '') {
        await updateCart({ gift_message: giftMessage }).unwrap();
      }
      await addCartItem(payload).unwrap()
      router.push('/cart')
    } catch (e) {
      console.error('Pack add error', e)
      // optionally surface a toast/snackbar
    }
  }

  if (isLoading) return <Spinner md />
  if (error || !products) return <div>Error loading products</div>

  const allergenSummary =
    selectedAllergens.length === 0
      ? 'No Allergens (applies only to bonbons)'
      : `${ALLERGENS.filter(a => selectedAllergens.includes(a.id))
          .map(a => a.name)
          .join(' and ')} (only for bonbons)`

  // strongly type to avoid ReactNode | false confusion
const steps: React.ReactNode[] = [
  <SignatureBoxStep
    products={products}
    priceMap={PRICE_MAP}
    onSelect={(p: Product) => { setSignatureBox(p); setStep(1); }}
  />,
  <ChocolateBarkStep
    products={products}
    onSelect={(p: Product) => { setChocolateBark(p); setStep(2); }}
  />,
  <HotChocolateStep
    products={products}
    onSelect={(p: Product) => { setHotChocolate(p); setStep(3); }}
  />,
  <GiftCardStep
    products={products}
    selected={giftCard}
    onSelect={(p: Product) => setGiftCard(p)}
    giftMessage={giftMessage}
    onMessageChange={setGiftMessage}
    onNext={() => setStep(4)}
  />,
  <BoxTypeStep
    options={PREBUILDS}
    selected={boxType}
    onChange={(option: 'PICK_AND_MIX' | 'RANDOM') => setBoxType(option)}
    onNext={() => setStep(5)}
  />,
  <AllergenStep
    allergens={ALLERGENS}
    selectedAllergens={selectedAllergens}
    setSelectedAllergens={setSelectedAllergens}
    allergenOption={selectedAllergens !== undefined ? allergenOption : null}
    setAllergenOption={setAllergenOption}
    onNext={() => setStep(boxType === 'RANDOM' ? 7 : 6)}
  />,
  // this one should stay conditional (needs signatureBox info)
  signatureBox && (
    <FlavourStep
      signatureBox={signatureBox}
      flavours={flavours}
      remaining={remaining}
      handleAddFlavour={handleAddFlavour}
      incrementQuantity={handleInc}
      decrementQuantity={handleDec}
      deleteFlavour={handleDec}
      handleClear={handleClear}
      selectedAllergens={selectedAllergens}
      onNext={() => setStep(7)}
      allFlavours={allFlavours}
    />
  ),
  <SummaryStep
    signatureBox={signatureBox as Product}
    chocolateBark={chocolateBark}
    hotChocolate={hotChocolate}
    giftCard={giftCard}
    flavours={flavours}
    allergenSummary={
      selectedAllergens.length === 0
        ? 'No Allergens (applies only to bonbons)'
        : `${ALLERGENS.filter(a => selectedAllergens.includes(a.id)).map(a => a.name).join(' and ')} (only for bonbons)`
    }
    price={PRICE_MAP[signatureBox?.units_per_box ?? 0]}
    onEdit={setStep}
    onConfirm={handleConfirm}
  />
]

  return (
    <div className="md:grid md:grid-cols-4 gap-8 mb-20">
      <aside className="hidden md:block md:col-span-1">
        <StepSidebar
          labels={STEP_LABELS}
          borders={STEP_BORDER}
          current={step}
          onChange={setStep}
        />
      </aside>
      <section className="md:col-span-3">
        <div className="mb-4">
          <p className="text-sm text-primary-text">{STEP_EXPLANATIONS[step]}</p>
        </div>
        {steps[step]}
      </section>
    </div>
  )
}