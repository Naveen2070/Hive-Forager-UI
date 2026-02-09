import { useState } from 'react'
import { Plus } from 'lucide-react'

import { TicketTierForm  } from './TicketTierForm'
import { TicketTierCard } from './TicketTierCard'
import type {
  EventDTO,
  TicketTierDTO,
  UpdateTicketTierRequest,
} from '@/types/event.type'
import type {TierFormValues} from './TicketTierForm';
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useTicketTierMutations } from '@/features/events/hooks/useTicketTiers.ts'
import { useAuthStore } from '@/store/auth.store.ts'

interface TicketTierManagerProps {
  event: EventDTO
}

export const TicketTierManager = ({ event }: TicketTierManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTier, setEditingTier] = useState<TicketTierDTO | null>(null)
  const { addTier, updateTier, deleteTier } = useTicketTierMutations(event.id)

  const handleOpenAdd = () => {
    setEditingTier(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (tier: TicketTierDTO) => {
    setEditingTier(tier)
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: TierFormValues) => {
    const payload = {
      ...data,
      // Ensure defaults if user didn't touch the date fields
      validFrom: data.validFrom || event.startDate,
      validUntil: data.validUntil || event.endDate,
      updatedBy: Number(useAuthStore.getState().user?.id),
    } satisfies UpdateTicketTierRequest

    if (editingTier) {
      updateTier.mutate(
        { id: editingTier.id, data: payload },
        { onSuccess: () => setIsDialogOpen(false) },
      )
    } else {
      addTier.mutate(payload as any, {
        onSuccess: () => setIsDialogOpen(false),
      })
    }
  }

  // Calculate default form values based on whether we are Adding or Editing
  const formDefaultValues: TierFormValues = editingTier
    ? {
        name: editingTier.name,
        price: editingTier.price,
        totalAllocation: editingTier.totalAllocation,
        validFrom: editingTier.validFrom,
        validUntil: editingTier.validUntil,
      }
    : {
        name: '',
        price: 0,
        totalAllocation: 100,
        validFrom: event.startDate,
        validUntil: event.endDate,
      }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Ticket Tiers</h3>
          <p className="text-sm text-slate-400">
            Manage pricing and availability
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="bg-blue-600 hover:bg-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Tier
        </Button>
      </div>

      {/* Grid of Tiers */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {event.ticketTiers.map((tier) => (
          <TicketTierCard
            key={tier.id}
            tier={tier}
            onEdit={handleOpenEdit}
            onDelete={(id) => deleteTier.mutate(id)}
          />
        ))}
      </div>

      {/* Shared Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {editingTier ? 'Edit Ticket Tier' : 'Add Ticket Tier'}
            </DialogTitle>
          </DialogHeader>

          <TicketTierForm
            defaultValues={formDefaultValues}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isPending={addTier.isPending || updateTier.isPending}
            submitLabel={editingTier ? 'Save Changes' : 'Create Tier'}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
