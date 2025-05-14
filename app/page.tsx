"use client";

import React, { useState, useEffect } from "react";
import { Backpack, BackpackFormData } from "./models/backpack";
import { backpackStore } from "./models/store";
import { mainContentStyle } from "./styles/pageStyles";
import toast from "react-hot-toast";
import { Navigation } from "./components/Navigation";
import { AddBackpackModal } from "./components/AddBackpackModal";
import { BackpackList } from "./components/BackpackList";
import { DeleteBackpackModal } from "./components/DeleteBackpackModal";
import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";
import { FilterModal } from "./components/FilterModal";
import { UpdateBackpackModal } from "./components/UpdateBackpackModal";
import { validateBackpackInputs } from "../helpers/validations";

export default function Home() {
  const [backpacks, setBackpacks] = useState<Backpack[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBackpack, setSelectedBackpack] = useState<string | null>(null);
  const [showListBackpack, setShowListBackpack] = useState(false);
  const [showUpdateBackpack, setShowUpdateBackpack] = useState(false);
  const [showSelectUpdateModal, setShowSelectUpdateModal] = useState(false);
  const [searchBrand, setSearchBrand] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    loadBackpacks();
  }, []);

  const loadBackpacks = () => {
    const allBackpacks = backpackStore.getAll();
    setBackpacks(allBackpacks);
  };

  const handleSelectBackpackForUpdate = (backpack: Backpack) => {
    setSelectedBackpack(backpack.id);
    setName(backpack.name);
    setBrand(backpack.brand);
    setMaterial(backpack.material);
    setWeight(String(backpack.weight));
    setColor("");
    setShowUpdateBackpack(true);
    setShowSelectUpdateModal(false);
  };

  const handleUpdate = () => {
    const validation = validateBackpackInputs(name, brand, material, weight);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    if (selectedBackpack) {
      const updatedData: BackpackFormData = {
        name,
        brand,
        material,
        weight: Number(weight),
      };

      backpackStore.updateBackpack(selectedBackpack, updatedData);
      loadBackpacks();
      setName("");
      setBrand("");
      setMaterial("");
      setWeight("");
      setColor("");
      setSelectedBackpack(null);
      setShowUpdateBackpack(false);
      toast.success(`${name} updated successfully!`);
    }
  };

  const handleAdd = () => {
    const validation = validateBackpackInputs(name, brand, material, weight);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    const newBackpack: BackpackFormData = {
      name,
      brand,
      material,
      weight: Number(weight),
    };

    backpackStore.addBackpack(newBackpack);
    loadBackpacks();
    setName("");
    setBrand("");
    setMaterial("");
    setWeight("");
    setColor("");
    setShowAddModal(false);
    toast.success(`${name} added successfully!`);
  };

  const handleDeleteBackpack = () => {
    if (selectedBackpack) {
      backpackStore.deleteBackpack(selectedBackpack);
      loadBackpacks();
      setSelectedBackpack(null);
      setShowConfirmModal(false);
      setShowDeleteModal(false);
      toast.success("Backpack deleted successfully!");
    }
  };

  const closeAllModals = () => {
    setShowAddModal(false);
    setShowDeleteModal(false);
    setShowUpdateBackpack(false);
    setShowListBackpack(false);
    setShowSelectUpdateModal(false);
    setShowFilterModal(false);
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "white" }}
    >
      <Navigation
        onAddClick={() => {
          closeAllModals();
          setShowAddModal(true);
        }}
        onDeleteClick={() => {
          closeAllModals();
          setShowDeleteModal(true);
        }}
        onListClick={() => {
          closeAllModals();
          setShowListBackpack(true);
        }}
        onUpdateClick={() => {
          closeAllModals();
          setShowSelectUpdateModal(true);
        }}
        onFilterClick={() => {
          closeAllModals();
          setShowFilterModal(true);
          setSearchBrand("");
        }}
        onSortIncreasingClick={() => {
          closeAllModals();
          setShowListBackpack(true);
          setBackpacks((prevBackpacks) =>
            [...prevBackpacks].sort((a, b) => a.weight - b.weight)
          );
          toast.success("Backpacks sorted by weight (increasing)");
        }}
        onSortDecreasingClick={() => {
          closeAllModals();
          setShowListBackpack(true);
          setBackpacks((prevBackpacks) =>
            [...prevBackpacks].sort((a, b) => b.weight - a.weight)
          );
          toast.success("Backpacks sorted by weight (decreasing)");
        }}
      />

      <div style={mainContentStyle}>
        {showAddModal && (
          <AddBackpackModal
            name={name}
            brand={brand}
            material={material}
            weight={weight}
            color={color}
            onNameChange={setName}
            onBrandChange={setBrand}
            onMaterialChange={setMaterial}
            onWeightChange={setWeight}
            onColorChange={setColor}
            onAdd={handleAdd}
            onClose={() => setShowAddModal(false)}
          />
        )}

        {showDeleteModal && (
          <DeleteBackpackModal
            backpacks={backpacks}
            onSelectBackpack={(id) => {
              setSelectedBackpack(id);
              setShowConfirmModal(true);
            }}
            onClose={() => setShowDeleteModal(false)}
          />
        )}

        {showConfirmModal && (
          <ConfirmDeleteModal
            onConfirm={handleDeleteBackpack}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        {showFilterModal && (
          <FilterModal
            backpacks={backpacks}
            searchBrand={searchBrand}
            color={color}
            onSearchChange={setSearchBrand}
            onClose={() => {
              setShowFilterModal(false);
              if (searchBrand) {
                toast.success(`Filtered backpacks by brand: ${searchBrand}`);
              }
            }}
          />
        )}

        {showUpdateBackpack && (
          <UpdateBackpackModal
            name={name}
            brand={brand}
            material={material}
            weight={weight}
            color={color}
            onNameChange={setName}
            onBrandChange={setBrand}
            onMaterialChange={setMaterial}
            onWeightChange={setWeight}
            onColorChange={setColor}
            onUpdate={handleUpdate}
            onClose={() => setShowUpdateBackpack(false)}
          />
        )}

        {showListBackpack && <BackpackList backpacks={backpacks} color={color} />}
      </div>
    </div>
  );
}
