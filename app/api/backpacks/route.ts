import { NextRequest, NextResponse } from 'next/server';
import { backpackDb } from '../db/backpackStore';
import { backpackSchema } from '../models/backpackSchema';
import { Pool } from 'pg';
import { ErrorMessages } from '@/enums/ErrorMessages';
import { isNumber } from '@/app/utils/validators';
import { create } from 'domain';

const pool = new Pool({
  user: 'admin',          
  host: 'postgres',
  database: 'backpack',       
  password: 'admin',      
  port: 5432,
});
export async function GET(request: NextRequest) {
  try {
    const response = await pool.query('SELECT * FROM backpacks'); 
    return NextResponse.json(response.rows); 
  } catch (error) {
    console.error(ErrorMessages.QUERY_DB_SELECT, ": ", error);
    return NextResponse.error();
  }
}
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { name, brand, material, weight, color, manufactureId } = body;
      const createdAt = "2025-05-14T16:39:33.845Z";
      if (!name || !brand || !material || !weight || !color || name.length < 3 || !isNumber(weight) || !isNumber(manufactureId)) {
        return NextResponse.json(
          { error: 'Bad request: Either null fields or invalid data' },
          { status: 400 }
        );
      }

      const checkIfbackpackWithSameNameExistsAlreadyQuery = `
            SELECT * FROM backpacks WHERE name=$1
      `
      const paramsForCheckingIfBackpackWithSameNameAlreadyExists = [name];
      const doesBackpackWithSameNameAlreadyExists = await pool.query(checkIfbackpackWithSameNameExistsAlreadyQuery, paramsForCheckingIfBackpackWithSameNameAlreadyExists);

      if (doesBackpackWithSameNameAlreadyExists.rows.length > 0) {
        return NextResponse.json(
            { error: `backpack with the name ${doesBackpackWithSameNameAlreadyExists.rows[0].name} already exists`},
            { status: 409 }
        )
      }

      const query = `
        INSERT INTO backpacks (name, brand, material, weight, color, "createdAt", "manufactureId")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [name, brand, material, weight, color, createdAt || null, manufactureId];
      const res = await pool.query(query, values);
  
      return NextResponse.json(res.rows[0], { status: 201 });
    } catch (error) {
      console.error(ErrorMessages.QUERY_DB_INSERT, ": ", error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, brand, material, weight, color, manufactureId } = body;

    if (!name || !brand || !material || !weight || !color || name.length < 3 || !isNumber(weight) || !isNumber(manufactureId)) {
     return NextResponse.json(
         { error: 'Bad request: Either null fields or invalid data' },
       { status: 400 }
     );
    }
    const checkIfbackpackWithSameNameExistsAlreadyQuery = `
          SELECT * FROM backpacks WHERE name=$1
    `
    const paramsForCheckingIfbackpackWithSameNameAlreadyExists = [name];
    const doesbackpackWithSameNameAlreadyExist = await pool.query(checkIfbackpackWithSameNameExistsAlreadyQuery, paramsForCheckingIfbackpackWithSameNameAlreadyExists);
    if (doesbackpackWithSameNameAlreadyExist.rows.length === 0) {
      return NextResponse.json(
          { error: `You can only update already existing backpacks.`},
          { status: 409 }
      )
    }
    const query = `
      UPDATE backpacks 
      SET brand = $2, material = $3, weight = $4, color = $5, "manufactureId" = $6
      WHERE name = $1
      RETURNING *;
    `;
    const values = [name, brand, material, weight, color, manufactureId];
    const res = await pool.query(query, values);
    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error(ErrorMessages.QUERY_DB_UPDATE, ": ", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    const checkIfbackpackWithSameNameExistsAlreadyQuery = `
          SELECT * FROM backpacks WHERE name=$1
    `
    const paramsForCheckingIfbackpackWithSameNameAlreadyExists = [name];
    const doesbackpackWithSameNameAlreadyExist = await pool.query(checkIfbackpackWithSameNameExistsAlreadyQuery, paramsForCheckingIfbackpackWithSameNameAlreadyExists);
    if (doesbackpackWithSameNameAlreadyExist.rows.length === 0) {
      return NextResponse.json(
          { error: `You can only delete already existing backpacks.`},
          { status: 409 }
      )
    }
    const query = `
      DELETE FROM backpacks WHERE name = $1 RETURNING *;
    `
    const params = [ name ];
    const res = await pool.query(query, params);
    return NextResponse.json(res.rows[0], { status: 202 })
  } catch (error) {
    console.error(ErrorMessages.QUERY_DB_DELETE, ":", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}