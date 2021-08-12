# CELOIPFSImage ChangeLog

Change Log file for the dacade [Celo Development 101](https://dacade.org/communities/celo-development-101) dApp submission by [devfemi](https://dacade.org/communities/celo-development-101/submissions/bfbb6497-d5f2-432a-a792-990b74ccecd1).

**```Keywords```**

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for soon-to-be removed features.
* `Removed` for now removed features.
* `Fixed` for any bug fixes.
* `Security` in case of vulnerabilities.

## [emmanuelJet](https://github.com/emmanuelJet) - 2021-08-12

Nice implementation of IPFS as an Image gallery. **Contract Review:** Continuing from [Emmanuel](https://github.com/Emmanuel-umeh) feedback and my agreement with the "manually passing their address" comment, I updated the contact by fixing the unauthorized user bug while following the original structure of having an address parameter. I then included a share functionality that leads to optimizing the contract to remove repeated codes. The list of included functions is: `getUserAccount`, `getUserImage`, `shareImage`, and `verifyImageParameters`. The list of optimized functions are `getSharedImage`, `getSharedImageCount`, `updateImage`, and `uploadImage`. This list of included modifiers is `verifyAccount` and `accountOwner`. The list of other optimized variables is `Image` struct and `LogImageActivity` event. Lastly, I included a profile functionality with an `Account` struct and `users` map. You can find my contract review on the *CeloIPFSImage.sol* and *celoIPFSImage.abi.json* file. **DApp Review:** The dApp was developed well; the code structures, used packages, and other things that sum up the dApp. **Design Review:** The UI is simple and sleek as it shows content appropriately. The routing of the pages is also perfect. I only have a concern on the single image page about the *Blockchain Details*. This page originally refreshes data periodically still noting but *N/A* is displayed on the provided space. Lastly, on this page, I think the image tag should be displayed. The dApp is simple, easy to use, and nice. Thank you as I learned a lot through the cause of providing feedback on your contract.

### Added

* CeloIPFSImage.sol file
* celoIPFSImage.abi.json file
* .editorconfig file
* CHANGELOG.md file
