export const handleAddBackpack = async (
name:string,
brand:string,
material:string,
weight:number,
color:string,
manufactureId:number
) => {
    // validations
    const newBackpack = {
        name,
        brand,
        material,
        weight,
        color,
        manufactureId
    }
     try {
    const response = await fetch("/api/backpacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBackpack),
    });

    if (!response.ok) {
      throw new Error("Failed to add backpack");
    }

    const data = await response.json();
    return data; 
  } catch (error: any) {
    throw new Error(error.message);
  }
    }
