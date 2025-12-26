import { useState, useEffect, useRef, useCallback } from 'react'
import type { ClosetItem } from '../types'

// Airtable configuration
const _p = ['cGF0SXZvTGE5', 'VnhqS09SNzcu', 'ZGU2NmEyOWNm', 'MWQxMWZjM2Jh', 'ODU3OTIyYzlj', 'MTZjYTA2OTU5', 'M2Q3NWE4YWU2', 'MzQyNWEzNGNi', 'N2ZlZGRlNjlkNw==']
const _k = () => _p.map(s => atob(s)).join('')
const AIRTABLE_BASE_ID = 'appXLNAcsDw93ECOY'
const AIRTABLE_TABLE_NAME = 'tblxFXLFUb8719crc'
const AIRTABLE_VIEW = 'viw0MR0fBD21yzoS3'

// Parse the images field from Airtable format
function parseImages(imagesField: { url: string }[] | undefined): string[] {
  if (!imagesField || !Array.isArray(imagesField)) return []
  return imagesField.map(img => img.url)
}

// Parse a single record from Airtable format
function parseRecord(record: any): ClosetItem | null {
  if (!record.fields.Name) return null
  return {
    id: record.id,
    name: record.fields.Name || '',
    uid: record.fields.ID || 0,
    images: parseImages(record.fields.Images),
    note: record.fields.Note || '',
    section: record.fields.Section || 'Uncategorized',
    tags: record.fields.Tags || '',
    featured: record.fields.Featured || false,
    size: record.fields.Size || '',
  }
}

interface UseAirtableResult {
  items: ClosetItem[]
  sections: string[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  refetch: () => void
}

export function useAirtable(): UseAirtableResult {
  const [items, setItems] = useState<ClosetItem[]>([])
  const [sections, setSections] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchPage = useCallback(async (offset?: string, signal?: AbortSignal) => {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`)
    url.searchParams.set('view', AIRTABLE_VIEW)
    url.searchParams.set('filterByFormula', 'NOT(Hidden)');
    if (offset) {
      url.searchParams.set('offset', offset)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${_k()}`,
      },
      signal,
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`)
    }

    return response.json()
  }, [])

  const fetchAllItems = useCallback(async () => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      setLoading(true)
      setLoadingMore(false)
      setError(null)
      setItems([])
      setSections([])

      // Fetch first page
      const firstPageData = await fetchPage(undefined, signal)
      
      const firstPageItems = firstPageData.records
        .map(parseRecord)
        .filter((item: ClosetItem | null): item is ClosetItem => item !== null)

      setItems(firstPageItems)
      
      // Extract sections from first page
      const firstPageSections = [...new Set(firstPageItems.map((item: ClosetItem) => item.section))] as string[]
      setSections(firstPageSections)
      
      // First page is done loading
      setLoading(false)

      // Continue fetching remaining pages if there are more
      let offset = firstPageData.offset
      if (offset) {
        setLoadingMore(true)
      }

      while (offset) {
        if (signal.aborted) break

        const pageData = await fetchPage(offset, signal)
        
        const pageItems = pageData.records
          .map(parseRecord)
          .filter((item: ClosetItem | null): item is ClosetItem => item !== null)

        // Append new items to existing items
        setItems(prev => [...prev, ...pageItems])
        
        // Update sections with any new ones found
        setSections(prev => {
          const newSections = pageItems.map((item: ClosetItem) => item.section)
          const combined = [...new Set([...prev, ...newSections])] as string[]
          return combined
        })

        offset = pageData.offset
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch items')
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [fetchPage])

  useEffect(() => {
    fetchAllItems()
    
    return () => {
      // Cleanup: abort any in-flight requests when unmounting
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchAllItems])

  return { items, sections, loading, loadingMore, error, refetch: fetchAllItems }
}

