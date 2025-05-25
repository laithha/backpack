import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { ErrorMessages } from '@/enums/ErrorMessages';

const pool = new Pool({
  user: 'admin',          
  host: 'postgres',
  database: 'backpack',       
  password: 'admin',      
  port: 5432,
});

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const brand = searchParams.get('brand');
    const material = searchParams.get('material');
    const minWeight = searchParams.get('minWeight');
    const maxWeight = searchParams.get('maxWeight');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    // Build the base query
    let query = 'SELECT * FROM backpacks';
    const queryParams: any[] = [];
    const conditions: string[] = [];
//ssh -i "C:\Users\esmai\Downloads\laith-key.pem" ec2-user@16.16.196.94
    // Add filtering conditions
    if (brand) {
      conditions.push(`brand ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${brand}%`);
    }

    if (material) {
      conditions.push(`material ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${material}%`);
    }

    if (minWeight) {
      conditions.push(`weight >= $${queryParams.length + 1}`);
      queryParams.push(minWeight);
    }

    if (maxWeight) {
      conditions.push(`weight <= $${queryParams.length + 1}`);
      queryParams.push(maxWeight);
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add sorting
    const validSortFields = ['name', 'brand', 'material', 'weight', 'createdAt'];
    const sanitizedSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sanitizedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY "${sanitizedSortBy}" ${sanitizedSortOrder}`;

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    // Execute the query
    const response = await pool.query(query, queryParams);

    // Get total count for pagination
    const countQuery = query.split('ORDER BY')[0].replace('SELECT *', 'SELECT COUNT(*)');
    const countResponse = await pool.query(countQuery, queryParams.slice(0, -2));
    const totalCount = parseInt(countResponse.rows[0].count);

    return NextResponse.json({
      data: response.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error(ErrorMessages.QUERY_DB_SELECT, ": ", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 