'use client'
import React, { useState, useEffect } from 'react'
import { useGetActiveProductsQuery } from '@/redux/features/products/productApiSlice'
import { useAddCartItemMutation } from '@/redux/features/carts/cartApiSlice'
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

import { PRICE_MAP, ID_MAP, ALLERGENS, PREBUILDS, STEP_LABELS, STEP_BORDER } from '@/components/packs/constants'
import { useRouter } from 'next/navigation'
import Spinner from "@/components/common/Spinner";

export default function PackBuilder() {
  const { data: products, isLoading, error } = useGetActiveProductsQuery()
  const [addCartItem, { isLoading: cartLoading }] = useAddCartItemMutation()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [signatureBox, setSignatureBox] = useState(null)
  const [chocolateBark, setChocolateBark] = useState(null)
  const [hotChocolate, setHotChocolate] = useState(null)
  const [giftCard, setGiftCard] = useState(null)
  const [boxType, setBoxType] = useState('PICK_AND_MIX')
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([])
  const [flavours, setFlavours] = useState([])
  const [remaining, setRemaining] = useState(0)
  const [giftMessage, setGiftMessage] = useState('')

  useEffect(() => {
    if (signatureBox) {
      setRemaining(signatureBox.units_per_box)
      setFlavours([])
    }
  }, [signatureBox])

  const handleAddFlavour = (f) => {
    if (remaining === 0) return
    const idx = flavours.findIndex(x => x.flavor.id === f.id)
    if (idx >= 0) {
      const u = [...flavours]; u[idx].quantity++; setFlavours(u)
    } else {
      setFlavours([...flavours, { flavor: f, quantity: 1 }])
    }
    setRemaining(r => r - 1)
  }
  const handleInc = (i) => remaining > 0 && handleAddFlavour(flavours[i].flavor)
  const handleDec = (i) => {
    const u = [...flavours]
    if (u[i].quantity > 1) {
      u[i].quantity--; setFlavours(u); setRemaining(r => r + 1)
    } else {
      const qty = u[i].quantity
      setFlavours(f => f.filter((_,j) => j !== i))
      setRemaining(r => r + qty)
    }
  }
  const handleClear = () => {
    setFlavours([]); setRemaining(signatureBox?.units_per_box || 0)
  }

  const handleConfirm = async () => {
    if (!signatureBox) return
    const finalBoxType = boxType as 'PICK_AND_MIX' | 'RANDOM'
    const productId = ID_MAP[signatureBox.units_per_box] || signatureBox.id
    const payload = {
      product: productId, quantity: 1,
      pack_customization: {
        selection_type: finalBoxType,
        flavor_selections: flavours.map(f => ({
          flavor: f.flavor.id, quantity: f.quantity
        })),
        chocolate_bark: chocolateBark?.id,
        hot_chocolate: hotChocolate?.id,
        gift_card: giftCard?.id,
      }
    }
    try {
      await addCartItem(payload).unwrap()
      router.push('/cart')
    } catch {}
  }

  if (isLoading) return <Spinner md />
  if (error || !products) return <div>Error loading products</div>

  // Helper for summary
  const allergenSummary = selectedAllergens.length === 0
    ? 'No Allergens (applies only to bonbons)'
    : `${ALLERGENS.filter(a => selectedAllergens.includes(a.id))
        .map(a => a.name)
        .join(' and ')} (only for bonbons)`

  // Step mapping
  const steps = [
    <SignatureBoxStep
      products={products}
      priceMap={PRICE_MAP}
      onSelect={p => { setSignatureBox(p); setStep(1) }}
    />,
    <ChocolateBarkStep
      products={products}
      onSelect={p => { setChocolateBark(p); setStep(2) }}
    />,
    <HotChocolateStep
      products={products}
      onSelect={p => { setHotChocolate(p); setStep(3) }}
    />,
    <GiftCardStep
      products={products}
      selected={giftCard}
      onSelect={p => setGiftCard(p)}
      giftMessage={giftMessage}
      onMessageChange={setGiftMessage}
      onNext={() => setStep(4)}
    />,
    <BoxTypeStep
      options={PREBUILDS}
      selected={boxType}
      onChange={setBoxType}
      onNext={() => setStep(5)}
    />,
    <AllergenStep
      allergens={ALLERGENS}
      selectedAllergens={selectedAllergens}
      setSelectedAllergens={setSelectedAllergens}
      allergenOption={"NONE"}
      setAllergenOption={() => {}}
      onNext={() => setStep(boxType === 'RANDOM' ? 7 : 6)}
    />,
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
    />,
    <SummaryStep
      signatureBox={signatureBox}
      chocolateBark={chocolateBark}
      hotChocolate={hotChocolate}
      giftCard={giftCard}
      flavours={flavours}
      allergenSummary={allergenSummary}
      price={PRICE_MAP[signatureBox?.units_per_box]}
      onEdit={setStep}
      onConfirm={handleConfirm}
    />
  ]

  return (
    <div className="md:grid md:grid-cols-4 gap-8">
      <aside className="hidden md:block md:col-span-1">
        <StepSidebar
          labels={STEP_LABELS}
          borders={STEP_BORDER}
          current={step}
          onChange={setStep}
        />
      </aside>
      <section className="md:col-span-3">
        {steps[step]}
      </section>
    </div>
  )
}