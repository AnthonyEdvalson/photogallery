import { useState, useEffect, useRef, useCallback } from 'react'
import type { ClosetItem } from '../types'
import waponImage from '../assets/wapon.jpeg'

// :)
const WAPON_ITEM: ClosetItem = {
  id: 'wapon-10000',
  name: '10,000 WAPONS',
  uid: -1,
  images: [waponImage],
  note: '',
  section: 'Wapon',
  tags: 'wapon',
  collections: [],
  size: 'For a pwincess in need',
}

const _p = ['cGF0SXZvTGE5', 'VnhqS09SNzcu', 'ZGU2NmEyOWNm', 'MWQxMWZjM2Jh', 'ODU3OTIyYzlj', 'MTZjYTA2OTU5', 'M2Q3NWE4YWU2', 'MzQyNWEzNGNi', 'N2ZlZGRlNjlkNw==']
const _k = () => _p.map(s => atob(s)).join('')
const AIRTABLE_BASE_ID = 'appXLNAcsDw93ECOY'
const AIRTABLE_TABLE_NAME = 'tblxFXLFUb8719crc'
const AIRTABLE_VIEW = 'viw0MR0fBD21yzoS3'

function parseImages(imagesField: { url: string }[] | undefined): string[] {
  if (!imagesField || !Array.isArray(imagesField)) return []
  return imagesField.map(img => img.url)
}

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
    collections: record.fields.Collections || [],
    size: record.fields.Size || '',
  }
}

interface UseAirtableResult {
  items: ClosetItem[]
  sections: string[]
  collections: string[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  refetch: () => void
}

export function useAirtable(): UseAirtableResult {
  const [items, setItems] = useState<ClosetItem[]>([])
  const [sections, setSections] = useState<string[]>([])
  const [collections, setCollections] = useState<string[]>([])
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
      setCollections([])

      const firstPageData = await fetchPage(undefined, signal)
      
      const firstPageItems = firstPageData.records
        .map(parseRecord)
        .filter((item: ClosetItem | null): item is ClosetItem => item !== null)

      setItems(firstPageItems)
      
      const firstPageSections = [...new Set(firstPageItems.map((item: ClosetItem) => item.section))] as string[]
      setSections(firstPageSections)
      
      const firstPageCollections = [...new Set(firstPageItems.flatMap((item: ClosetItem) => item.collections))] as string[]
      setCollections(firstPageCollections)
      
      setLoading(false)

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

        setItems(prev => [...prev, ...pageItems])
        
        setSections(prev => {
          const newSections = pageItems.map((item: ClosetItem) => item.section)
          const combined = [...new Set([...prev, ...newSections])] as string[]
          return combined
        })
        
        setCollections(prev => {
          const newCollections = pageItems.flatMap((item: ClosetItem) => item.collections)
          const combined = [...new Set([...prev, ...newCollections])] as string[]
          return combined
        })

        offset = pageData.offset
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchAllItems])

  const allItems = [WAPON_ITEM, ...items]
  return { items: allItems, sections, collections, loading, loadingMore, error, refetch: fetchAllItems }
}

