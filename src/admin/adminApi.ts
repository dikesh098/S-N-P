import { supabase } from '../lib/supabase'
import type { Row } from '../lib/util'

function must() {
  if (!supabase) throw new Error('Connect Supabase first (see .env.example).')
  return supabase
}

export async function listAll(table: string, orderBy = 'created_at', ascending = false): Promise<Row[]> {
  const { data, error } = await must().from(table).select('*').order(orderBy, { ascending })
  if (error) throw error
  return data || []
}

export async function insertRow(table: string, values: Row): Promise<Row> {
  const { data, error } = await must().from(table).insert(values).select().single()
  if (error) throw error
  return data
}

export async function updateRow(table: string, id: string, values: Row): Promise<Row> {
  const { data, error } = await must().from(table).update(values).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await must().from(table).delete().eq('id', id)
  if (error) throw error
}

export async function updateField(table: string, id: string, field: string, value: unknown): Promise<void> {
  const { error } = await must().from(table).update({ [field]: value }).eq('id', id)
  if (error) throw error
}
