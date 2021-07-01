import { SharesTimeLock, Deposited } from "../generated/SharesTimeLock/SharesTimeLock"
import { Staker, Lock, GlobalStat } from "../generated/schema"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

const UNIQUE_STAT_ID = "unique_stats_id";

export class ShareTimeLockHelper {
  constructor() {}

  static updateStakingData(contractAddress: Address, fromAddress: Address): Staker {
    // loading the contract, and calling the getStakingData function...
    let sharesTimeLock = SharesTimeLock.bind(contractAddress)
    let stakingData = sharesTimeLock.getStakingData(fromAddress);
  
    // loading staker entity, or creating if it doesn't exist yet...
    let staker = Staker.load(fromAddress.toHex());
  
    if (staker == null) {
      staker = new Staker(fromAddress.toHex());
    }
  
    // refilling the staked entity...
    staker.totalStaked = stakingData.totalStaked;
    staker.veTokenTotalSupply = stakingData.veTokenTotalSupply;
    staker.accountVeTokenBalance = stakingData.accountVeTokenBalance;
    staker.accountWithdrawableRewards = stakingData.accountWithdrawableRewards;
    staker.accountWithdrawnRewards = stakingData.accountWithdrawnRewards;
    staker.accountDepositTokenBalance = stakingData.accountDepositTokenBalance;
    staker.accountDepositTokenAllowance = stakingData.accountDepositTokenAllowance;
    staker.save();
    
    return <Staker>staker;
  }

  static updateGlobalGlobalStats(): GlobalStat {
    // loading stats entity, or creating if it doesn't exist yet...
    let stats = GlobalStat.load(UNIQUE_STAT_ID);
    
    if (stats == null) {
      stats = new GlobalStat(UNIQUE_STAT_ID);
      stats.locksCounter = BigInt.fromI32(1);
    } else {
      stats.locksCounter = stats.locksCounter.plus(BigInt.fromI32(1));
    }

    // saving stats entity...
    stats.save();    
    return <GlobalStat>stats;
  }

  static updateLock(hash: Bytes, lockId: BigInt, lockDuration: BigInt, timestamp: BigInt, amount: BigInt, staker: Staker): Lock {
    // loading lock entity, or creating if it doesn't exist yet...
    let lock = Lock.load(hash.toHex());

    if (lock == null) {
      lock = new Lock(hash.toHex());
    }

    // filling the lock entity...
    lock.lockId = lockId;
    lock.lockDuration = lockDuration;
    lock.lockedAt = timestamp;
    lock.amount = amount;
    lock.staker = staker.id;
    lock.withdrawn = false;

    // saving lock entity...
    lock.save();   
    return <Lock>lock; 
  }
}