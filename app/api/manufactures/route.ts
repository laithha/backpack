import { ErrorMessages } from "@/enums/ErrorMessages";
import { NextResponse } from "next/server";
import { manufactures } from "@/app/models/types";
import { Pool } from "pg";

const pool = new Pool({
  user: 'admin',          
  host: 'postgres',
  database: 'backpack',       
  password: 'admin',      
  port: 5432,
});

export async function GET() {
    try {
        const response = await pool.query('SELECT * FROM manufactures');
        return NextResponse.json(response.rows);
    } catch(error) {
        console.error("Error fetching manufactures:", error);
        return NextResponse.json({ error: "Failed to fetch manufacturers" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { name, country } = body;
  
      if (!name || name.length < 3 || !country || country.length < 3) {
        return NextResponse.json(
          { error: "Bad request: invalid name for manufactures" },
          { status: 400 }
        );
      }
  
      const checkIfmanufacturesWithSameNameExistsQuery = `
        SELECT * FROM manufactures WHERE name=$1
      `;
      const paramsForCheckingIfmanufacturesWithSameNameExists = [name];
      const doesmanufacturesWithSameNameExist = await pool.query(
        checkIfmanufacturesWithSameNameExistsQuery,
        paramsForCheckingIfmanufacturesWithSameNameExists
      );
  
      if (doesmanufacturesWithSameNameExist.rows.length > 0) {
        return NextResponse.json(
          {
            error: `Manufacturer with the name ${doesmanufacturesWithSameNameExist.rows[0].name} already exists`,
          },
          { status: 409 }
        );
      }
  
      const query = `
        INSERT INTO manufactures (name, country)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const values = [name, country];
      const res = await pool.query(query, values);
  
      return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
      console.error("Error inserting manufactures:", error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  

  export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const { id, name, country } = body;
  
      if (!id || !name || name.length < 3 || !country || country.length < 3) {
        return NextResponse.json(
          { error: "Bad request: Either null fields or invalid data" },
          { status: 400 }
        );
      }
  
      const checkIfManufacturerExistsQuery = `
        SELECT * FROM manufactures WHERE id=$1
      `;
      const paramsForCheckingManufacturerExistence = [id];
      const manufacturerExist = await pool.query(
        checkIfManufacturerExistsQuery,
        paramsForCheckingManufacturerExistence
      );
  
      if (manufacturerExist.rows.length === 0) {
        return NextResponse.json(
          { error: `Manufacturer with ID ${id} does not exist.` },
          { status: 404 }
        );
      }
  
      const query = `
        UPDATE manufactures 
        SET name = $2, country = $3
        WHERE id = $1
        RETURNING *;
      `;
      const values = [id, name, country];
      const res = await pool.query(query, values);
  
      return NextResponse.json(res.rows[0], { status: 200 });
    } catch (error) {
      console.error("Error updating manufacturer: ", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request) {
    try {
      const body = await request.json();
      const { name } = body;
  
      if (!name) {
        return NextResponse.json(
          { error: "Bad request: Manufacturer name is required" },
          { status: 400 }
        );
      }
  
      const checkIfManufacturerExistsQuery = `
        SELECT * FROM manufactures WHERE name=$1
      `;
      const paramsForCheckingManufacturerExistence = [name];
      const manufacturerExist = await pool.query(
        checkIfManufacturerExistsQuery,
        paramsForCheckingManufacturerExistence
      );
  
      if (manufacturerExist.rows.length === 0) {
        return NextResponse.json(
          { error: `Manufacturer with name ${name} does not exist.` },
          { status: 404 }
        );
      }
  
      const query = `
        DELETE FROM manufactures WHERE name = $1 RETURNING *;
      `;
      const params = [name];
      const res = await pool.query(query, params);
  
      return NextResponse.json(res.rows[0], { status: 200 });
    } catch (error) {
      console.error("Error deleting manufacturer: ", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  