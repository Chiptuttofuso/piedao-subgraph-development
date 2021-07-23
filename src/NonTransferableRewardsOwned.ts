import {
  Approval,
  ClaimedFor,
  OwnershipTransferred,
  RewardsDistributed,
  RewardsRedistributed,
  RewardsWithdrawn,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer
} from "../generated/NonTransferableRewardsOwned/NonTransferableRewardsOwned"
import { NonTransferableRewardsOwnedHelper } from "../helpers/NonTransferableRewardsOwned"
import { log } from "@graphprotocol/graph-ts"

export function handleRewardsWithdrawn(event: RewardsWithdrawn): void {
  NonTransferableRewardsOwnedHelper.saveRewards(
    event.transaction.hash.toHex(), 
    event.block.timestamp, 
    event.params.fundsWithdrawn,
    event.params.by.toHex(),
    "claimed");
}

export function handleRewardsRedistributed(event: RewardsRedistributed): void {
  NonTransferableRewardsOwnedHelper.saveRewards(
    event.transaction.hash.toHex(), 
    event.block.timestamp, 
    event.params.amount,
    event.params.account.toHex(),
    "slashed");  
}

export function handleClaimedFor(event: ClaimedFor): void {
  log.info("----- handleClaimedFor -----", []);
}

export function handleRewardsDistributed(event: RewardsDistributed): void {
  NonTransferableRewardsOwnedHelper.saveRewards(
    event.transaction.hash.toHex(), 
    event.block.timestamp, 
    event.params.rewardsDistributed,
    event.params.by.toHex(),
    "distributed"); 
}

/*
 * Not Needed Functions for now.
 */

export function handleApproval(event: Approval): void {}

export function handleTransfer(event: Transfer): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
