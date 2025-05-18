'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Backpack, BackpackFormData } from './models/types';
import { backpackStore } from './models/store';
import { CSSProperties } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { error } from 'console';
import { parse } from 'path';
import { handleAddBackpack } from '@/helpers/helpers';

export default function Home() {
  const [backpacks, setBackpacks] = useState<Backpack[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [manufactureId, setManufactureId] = useState("");
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

  // Helper function to check if a string is a number
  const isNumber = (value: string): boolean => {
    return !isNaN(Number(value));
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
    // Input validation with error notifications
    if (!name || name.length < 3) {
      toast.error("Name must be at least 3 characters long");
      return;
    }
    if (!brand || brand.length < 3) {
      toast.error("Brand must be at least 3 characters long");
      return;
    }
    if (!material || material.length < 3) {
      toast.error("Material must be at least 3 characters long");
      return;
    }
    if (!weight || !isNumber(weight)) {
      toast.error("Weight must be a valid number");
      return;
    }

    if (!selectedBackpack) {
      toast.error("No backpack selected for update");
      return;
    }

    try {
      const updatedData: BackpackFormData = {
        name,
        brand,
        material,
        weight: Number(weight)
      };
      
      const result = backpackStore.updateBackpack(selectedBackpack, updatedData);
      
      if (result) {
        loadBackpacks();
        setName("");
        setBrand("");
        setMaterial("");
        setWeight("");
        setColor("");
        setSelectedBackpack(null);
        setShowUpdateBackpack(false);
        toast.success(`${name} updated successfully!`);
      } else {
        toast.error(`Failed to update backpack`);
      }
    } catch (error: any) {
      console.error("Error updating backpack:", error);
      toast.error(`Error: ${error.message || "Unknown error occurred during update"}`);
    }
  };

  const handleAdd = async () => {
    try {
        // Input validation
        if (name.length < 3) {
            toast.error("Name must be at least 3 characters long");
            return;
        }
        if (brand.length < 3) {
            toast.error("Brand must be at least 3 characters long");
            return;
        }
        if (material.length < 3) {
            toast.error("Material must be at least 3 characters long");
            return;
        }
        if (!weight || !isNumber(weight)) {
            toast.error("Weight must be a valid number");
            return;
        }
        if (!manufactureId || !isNumber(manufactureId)) {
            toast.error("Please select a valid manufacturer ID");
            return;
        }
        if (!color) {
            toast.error("Please specify a color");
            return;
        }

        const newBackpack = await handleAddBackpack(
            name,
            brand,
            material,
            parseFloat(weight),
            color,
            parseInt(manufactureId)
        );
        
        if (!newBackpack) {
            toast.error("Failed to add backpack");
            return;
        }
        
        // Clear form fields first
        setName("");
        setBrand("");
        setMaterial("");
        setWeight("");
        setColor("");
        setManufactureId("");
        
        // Close the modal
        setShowAddModal(false);
        
        // Refresh list
        loadBackpacks();
        
        // Show success message after modal is closed
        toast.success(`Backpack "${name}" added successfully!`);
        
        // Show the backpack list
        setShowListBackpack(true);
    } catch (error: any) {
        if (error.message.includes("already exists")) {
            toast.error(`A backpack with this name already exists`);
        } else if (error.message.includes("Required fields")) {
            toast.error("Please fill in all required fields");
        } else {
            toast.error(`Error: ${error.message}`);
        }
        console.error("Error adding backpack:", error);
    }
};

  const handleDeleteBackpack = () => {
    if (!selectedBackpack) {
      toast.error("No backpack selected for deletion");
      return;
    }
     
    try {
      // Get the backpack name before deletion for the success message
      const backpackToDelete = backpacks.find(bp => bp.id === selectedBackpack);
      const backpackName = backpackToDelete ? backpackToDelete.name : 'Backpack';
      
      const result = backpackStore.deleteBackpack(selectedBackpack);
      
      if (result) {
        loadBackpacks();
        setSelectedBackpack(null);
        setShowConfirmModal(false);
        setShowDeleteModal(false);
        toast.success(`${backpackName} deleted successfully!`);
      } else {
        toast.error(`Failed to delete ${backpackName}`);
      }
    } catch (error: any) {
      console.error("Error deleting backpack:", error);
      toast.error(`Error: ${error.message || "Unknown error occurred during deletion"}`);
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

  const modalStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px"
  };

  const inputStyle: CSSProperties = {
    padding: "10px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  };

  const confirmButton: CSSProperties = {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const cancelButton: CSSProperties = {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const cardStyle: CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "white" }}>
      <nav
        style={{
          width: "220px", height: "100vh", backgroundColor: "#1e1e2f",
          color: "white", display: "flex", flexDirection: "column",
          alignItems: "flex-start", padding: "30px 20px", gap: "20px",
          position: "fixed", left: "0", top: "0", boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
        }}
      >
        <Link href="/" style={{
          backgroundColor: "#0070f3", padding: "10px", width: "100%",
          textAlign: "center", color: "white", textDecoration: "none",
          fontWeight: "bold", fontSize: "18px", borderRadius: "8px",
        }}>
          Backpack Management Website
        </Link>
        <button onClick={() => {
          closeAllModals();
          setShowAddModal(true);
        }} style={{
          background: "#2c2c3e", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
        }}>
          Add Backpack
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowDeleteModal(true);
        }} style={{
          background: "#2c2c3e", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
        }}>
          Delete Backpack
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowListBackpack(true);
        }} style={{
          background: "#2c2c3e", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
        }}>
          List Backpacks
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowSelectUpdateModal(true);
        }} style={{
          background: "#2c2c3e",
          color: "white",
          border: "none",
          padding: "10px 15px",
          width: "100%",
          borderRadius: "8px",
          cursor: "pointer",
        }}>
          Update Backpack
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowFilterModal(true);
          setSearchBrand("");
        }} style={{
          background: "#2c2c3e", 
          color: "white", 
          border: "none",
          padding: "10px 15px", 
          width: "100%", 
          borderRadius: "8px", 
          cursor: "pointer"
        }}>
          Filter By Brand
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowListBackpack(true);
          setBackpacks(prevBackpacks =>
            [...prevBackpacks].sort((a, b) => a.weight - b.weight)
          );
          toast.success("Backpacks sorted by weight (increasing)");
        }} style={{
          background: "#2c2c3e", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
        }}>
          Sort by weight increasing
        </button>
        <button onClick={() => {
          closeAllModals();
          setShowListBackpack(true);
          setBackpacks(prevBackpacks =>
            [...prevBackpacks].sort((a, b) => b.weight - a.weight)
          );
          toast.success("Backpacks sorted by weight (decreasing)");
        }} style={{
          background: "#2c2c3e", color: "white", border: "none",
          padding: "10px 15px", width: "100%", borderRadius: "8px", cursor: "pointer",
        }}>
          Sort by weight decreasing
        </button>
      </nav>

      <div style={{ marginLeft: "220px", padding: "20px", flex: 1, overflowY: "auto", backgroundColor: "white", color: "black" }}>
        {showAddModal && (
          <div style={{
            position: "fixed", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", backgroundColor: "white",
            padding: "30px", borderRadius: "12px",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            display: "flex", flexDirection: "column",
            gap: "15px", alignItems: "center", zIndex: 1000,
            width: "350px", color: "black"
          }}> 
            <h3>Add Backpack</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type='text' value={manufactureId} onChange={(e) => setManufactureId(e.target.value)} placeholder='manufatureId' style={{padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"}}></input>
            <button onClick={() => { setName("Nike Backpack"); setBrand("Nike"); setMaterial("cotton"); setWeight("5"); setColor("red") }} 
              style={{ backgroundColor: "#f0f0f0", color: "black", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}>
              quickadd
            </button>
            <button onClick={() => { setName("Adidas Backpack"); setBrand("Adidas"); setMaterial("cotton"); setWeight("2"); setColor("red") }}
              style={{ backgroundColor: "#f0f0f0", color: "black", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}>
              quickadd
            </button>
            <button onClick={() => { setName("Rebook Backpack"); setBrand("Nike"); setMaterial("cotton"); setWeight("4"); setColor("red") }}
              style={{ backgroundColor: "#f0f0f0", color: "black", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}>
              quickadd
            </button>
            <button onClick={() => { setName("LV Backpack"); setBrand("Nike"); setMaterial("cotton"); setWeight("1"); setColor("red") }}
              style={{ backgroundColor: "#f0f0f0", color: "black", padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}>
              quickadd
            </button>
            <button onClick={handleAdd} style={{ backgroundColor: "green", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}>Add</button>
            <button onClick={() => setShowAddModal(false)} style={cancelButton}>Close</button>
          </div>
        )}

        {showFilterModal && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
            color: "black"
          }}>
            <h3>Filter Backpacks by Brand</h3>
            <input
              type="text"
              placeholder="Enter brand name to filter"
              value={searchBrand}
              onChange={(e) => setSearchBrand(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "6px",
                border: "1px solid #ccc",
                outline: "none",
                backgroundColor: "#f5f5f5",
                color: "black"
              }}
            />
            
            {searchBrand && (
              <div style={{
                maxHeight: "300px",
                overflowY: "auto",
                width: "100%",
                marginTop: "15px",
              }}>
                {backpacks.filter(bp => bp.brand.toLowerCase().includes(searchBrand.toLowerCase())).length === 0 ? (
                  <div style={{
                    padding: "15px",
                    textAlign: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    color: "black"
                  }}>
                    No backpacks match the brand "{searchBrand}".
                  </div>
                ) : (
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}>
                    {backpacks
                      .filter(bp => bp.brand.toLowerCase().includes(searchBrand.toLowerCase()))
                      .map((backpack, index) => (
                        <div key={index} style={{
                          backgroundColor: "white",
                          padding: "15px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                          color: "black"
                        }}>
                          <p><strong>Name:</strong> {backpack.name}</p>
                          <p><strong>Brand:</strong> {backpack.brand}</p>
                          <p><strong>Material:</strong> {backpack.material}</p>
                          <p><strong>Weight:</strong> {backpack.weight}g</p>
                          <p><strong>Color:</strong> {color}</p>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            )}
            <button onClick={() => {
              setShowFilterModal(false);
              if (searchBrand) {
                toast.success(`Filtered backpacks by brand: ${searchBrand}`);
              }
            }} style={{
              ...cancelButton,
              marginTop: "15px"
            }}>Close</button>
          </div>
        )}

        {showSelectUpdateModal && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
            color: "black"
          }}>
            <h3>Select Backpack to Update</h3>
            {backpacks.length === 0 ? (
              <div style={{
                padding: "15px",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                color: "black"
              }}>
                No backpacks available to update.
              </div>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
                {backpacks.map((backpack, index) => (
                  <div key={index} onClick={() => {
                    handleSelectBackpackForUpdate(backpack);
                    toast.success(`Selected backpack: ${backpack.name}`);
                  }} style={{
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                    color: "black"
                  }}>
                    {backpack.name}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowSelectUpdateModal(false)} style={cancelButton}>Cancel</button>
          </div>
        )}
        
        {showUpdateBackpack && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
            color: "black"
          }}>
            <h3>Update Backpack</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Material" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color" style={{
              padding: "10px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              outline: "none",
              backgroundColor: "#f5f5f5",
              color: "black"
            }} />
            <button onClick={handleUpdate} style={confirmButton}>Update</button>
            <button onClick={() => setShowUpdateBackpack(false)} style={cancelButton}>Close</button>
          </div>
        )} 

        {showDeleteModal && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
            color: "black"
          }}>
            <h3>Select Backpack to Delete</h3>
            {backpacks.length === 0 ? (
              <div style={{
                padding: "15px",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
                color: "black"
              }}>
                No backpacks available to delete.
              </div>
            ) : (
              <div style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
                {backpacks.map((backpack, index) => (
                  <div key={index} onClick={() => {
                    setSelectedBackpack(backpack.id);
                    setShowConfirmModal(true);
                  }} style={{
                    backgroundColor: "#f0f0f0", 
                    padding: "10px",
                    marginBottom: "5px", 
                    borderRadius: "5px",
                    cursor: "pointer", 
                    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                    color: "black"
                  }}>
                    {backpack.name}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowDeleteModal(false)} style={cancelButton}>Cancel</button>
          </div>
        )} 

        {showConfirmModal && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "300px",
            color: "black"
          }}>
            <h3>Are you sure you want to delete this backpack?</h3>
            <button onClick={handleDeleteBackpack} style={confirmButton}>Yes, Delete</button>
            <button onClick={() => setShowConfirmModal(false)} style={cancelButton}>Cancel</button>
          </div>
        )}
        
        {showListBackpack && (
          <div style={{
            marginTop: "20px", 
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "20px",
            overflowY: "auto",
          }}>
            {backpacks.length === 0 ? (
              <h1 style={{ gridColumn: "span 3", textAlign: "center", color: "black" }}>No backpacks added yet.</h1>
            ) : (
              backpacks.map((backpack, index) => (
                <div key={index} style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  color: "black"
                }}>
                  <p><strong>Name:</strong> {backpack.name}</p>
                  <p><strong>Brand:</strong> {backpack.brand}</p>
                  <p><strong>Material:</strong> {backpack.material}</p>
                  <p><strong>Weight:</strong> {backpack.weight}g</p>
                  <p><strong>Color:</strong> {color}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
