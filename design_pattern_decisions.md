# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in two functions: `updateFee()` and `withdraw()`. These functions should not need to be used by anyone else apart from the contract owner.

## Inheritance and Interfaces

- `MyEpicGame` contract inherits OpenZeppelin's `ERC721` contract to use a standard interface for non-fungible tokens.
- `MyEpicGame` contract inherits OpenZeppelin's `Ownable` contract to enable ownership for one managing user.