export const determineGameOutcome = (
    playerTotal: number,
    dealerTotal: number,
): 'win' | 'lose' | 'tie' | 'bust' => {
    // Both over 20 - tie (half refund)
    if (playerTotal > 20 && dealerTotal > 20) {
        return 'bust';
    }
    
    // Player over 20 - lose
    if (playerTotal > 20) {
        return 'lose';
    }
    
    // Dealer over 20 - lose
    if (dealerTotal > 20) {
        return 'win';
    }
    
    // Both under/equal to 20
    if (playerTotal <= 20 && dealerTotal <= 20) {
        if (playerTotal > dealerTotal) {
            return 'win';  // Player higher than dealer - lose
        } else if (playerTotal === dealerTotal) {
            return 'tie';   // Equal hands - tie
        }
    }
    
    return 'lose';  // All other conditions result in loss
}