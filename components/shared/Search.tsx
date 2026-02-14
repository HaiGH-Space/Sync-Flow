'use client'
import { KeyboardEvent, memo, useState } from "react"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2Icon, SearchIcon } from "lucide-react"

type SearchProps = React.ComponentProps<typeof Field> & {
    placeholder?: string
    onSearch: (query: string) => Promise<void>,
}

export const Search = memo(function Search({ placeholder = "Search...", onSearch, ...props }: SearchProps) {
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const handleSearch = async () => {
       try {
            setIsLoading(true)
            await onSearch(query)
        } catch (error) {
            console.error("Search failed:", error)
        } finally {
            setIsLoading(false)
        }
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isLoading) {
            handleSearch()
        }
    }
    return (
        <Field {...props} orientation="horizontal">
            <Input aria-label={placeholder} type="search" placeholder={placeholder} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} disabled={isLoading}/>
            <Button
                className="cursor-pointer"
                size={'icon-lg'}
                onClick={handleSearch} 
                disabled={isLoading}
                aria-label="Submit search" 
            >
                {isLoading ? (
                    <Loader2Icon/> 
                ) : (
                    <SearchIcon/> 
                )}
            </Button>
        </Field>
    )
})