export const handleAddBackpack = async (
  name: string,
  brand: string,
  material: string,
  weight: number,
  color: string,
  manufactureId: number
) => {
  if (!name || !brand || !material || !weight || !color || !manufactureId) {
    throw new Error("Required fields are missing");
  }

  const newBackpack = {
    name,
    brand,
    material,
    weight,
    color,
    manufactureId
  };

  try {
    const response = await fetch("/api/backpacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBackpack),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Handle specific error responses from the API
      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error(`Failed to add backpack: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
