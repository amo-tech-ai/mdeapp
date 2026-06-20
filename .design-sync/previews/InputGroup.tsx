import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
} from "mdeapp"

const SearchGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const Search = () => (
  <InputGroup className="w-72">
    <InputGroupAddon align="inline-start">
      <SearchGlyph />
    </InputGroupAddon>
    <InputGroupInput placeholder="Search Medellín events…" />
  </InputGroup>
)

export const WithButton = () => (
  <InputGroup className="w-80">
    <InputGroupInput placeholder="Add a ticket tier name" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton>Add</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
)

export const WithPrefix = () => (
  <InputGroup className="w-72">
    <InputGroupAddon align="inline-start">
      <InputGroupText>$</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput defaultValue="35" inputMode="numeric" />
    <InputGroupAddon align="inline-end">
      <InputGroupText>USD</InputGroupText>
    </InputGroupAddon>
  </InputGroup>
)
