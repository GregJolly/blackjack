"use server"
import { handScore } from "../handScore"
import { Card } from "../types"
 export default function HitAction({deck, playerHand, dealerHand, hitButton, result} : {deck: Card[], playerHand: Card[], dealerHand: Card [], hitButton: boolean, result : string})
 {

    return {deck, playerHand, dealerHand, hitButton, result }
 }
