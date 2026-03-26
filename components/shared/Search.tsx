'use client'
import { memo, useEffect, useRef, useState } from "react"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { useTranslations } from "next-intl"

type SearchProps = React.ComponentProps<typeof Field> & {
    placeholder?: string
    onSearch: (query: string) => void | Promise<void>
    debounceMs?: number
}

export const Search = memo(function Search({ placeholder, onSearch, debounceMs = 300, ...props }: SearchProps) {
    const t = useTranslations('common')
    const resolvedPlaceholder = placeholder ?? t('search.placeholder')
    const [query, setQuery] = useState("")
    const hasUserTypedRef = useRef(false)

    useEffect(() => {
        if (!hasUserTypedRef.current) {
            return
        }

        const timer = window.setTimeout(() => {
            Promise.resolve(onSearch(query)).catch((error) => {
                console.error("Search failed:", error)
            })
        }, debounceMs)

        return () => {
            window.clearTimeout(timer)
        }
    }, [debounceMs, onSearch, query])

    return (
        <Field {...props} orientation="horizontal">
            <Input
                aria-label={resolvedPlaceholder}
                type="search"
                placeholder={resolvedPlaceholder}
                value={query}
                onChange={(e) => {
                    hasUserTypedRef.current = true
                    setQuery(e.target.value)
                }}
            />
        </Field>
    )
})