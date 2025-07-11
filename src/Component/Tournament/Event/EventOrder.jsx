import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { checkRoles } from "../../../utils/roleCheck";
import { ADMIN_ROLES, TOURNAMENT_OWNER_ROLES } from "../../../Constant/Roles";
import axiosInstance from "../../../Services/axios";

const SortableItem = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isDragging ? "#E5E7EB" : "#fff",
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border rounded-lg p-4 shadow-sm flex justify-between items-center text-[16px] text-gray-800"
    >
      <span>{name}</span>
      <span className="text-gray-400 text-sm">↕</span>
    </li>
  );
};

const EventOrder = ({ tournamentId, isOpen, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getAllCategoriesByTournament = async () => {
    try {
      let url = null;

      if (checkRoles(ADMIN_ROLES)) {
        url = `/users/admin/tournaments/${tournamentId}/categories`;
      } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
        url = `/users/tournament-owner/tournaments/${tournamentId}/categories`;
      }

      if (!url) return;

      const res = await axiosInstance.get(url);
      console.log("🚀 ~ getAllCategoriesByTournament ~ res:", res)
      setItems(res.data.data.categories); // assuming your API returns { data: [...] }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && tournamentId) {
      getAllCategoriesByTournament();
    }
  }, [isOpen, tournamentId]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSave = async () => {
    const orderedIds = items.map((item) => item._id);
    const payload = { categoryIds: orderedIds };

    try {
      let url = null;

      if (checkRoles(ADMIN_ROLES)) {
        url = `/users/admin/tournaments/${tournamentId}/categories/update-order`;
      } else if (checkRoles(TOURNAMENT_OWNER_ROLES)) {
        url = `/users/tournament-owner/tournaments/${tournamentId}/categories/update-order`;
      }

      if (!url) {
        console.error("User does not have permission to update order.");
        return;
      }

      const res = await axiosInstance.post(url, payload);
      console.log("✅ Order updated successfully:", res.data);
      onClose();
    } catch (err) {
      console.error("❌ Failed to update order:", err);
      alert("Something went wrong while saving the new order.");
    }
  };


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Change Event Order
            </Dialog.Title>
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading categories...</div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No categories found.</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item._id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-2">
                  {items.map((item) => (
                    <SortableItem key={item._id} id={item._id} name={item.categoryName} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
            >
              Save Order
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EventOrder;
