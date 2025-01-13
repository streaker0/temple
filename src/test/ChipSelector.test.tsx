// import { describe, it, expect, vi } from 'vitest';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { ChipSelector } from '../components/BettingPage/ChipSelector';
// import { CHIP_DENOMINATIONS } from '../constants/game.constants';

// describe('ChipSelector', () => {
//     const defaultProps = {
//         show: true,
//         selectedDenomination: 10,
//         onSelect: vi.fn(),
//         onClickOutside: vi.fn()
//     };

//     it('renders chip buttons when show is true', () => {
//         render(<ChipSelector {...defaultProps} />);
        
//         CHIP_DENOMINATIONS.forEach(value => {
//             expect(screen.getByText(`$${value}`)).toBeInTheDocument();
//         });
//     });

//     it('does not render when show is false', () => {
//         render(<ChipSelector {...defaultProps} show={false} />);
        
//         CHIP_DENOMINATIONS.forEach(value => {
//             expect(screen.queryByText(`$${value}`)).not.toBeInTheDocument();
//         });
//     });

//     it('highlights selected denomination', () => {
//         render(<ChipSelector {...defaultProps} selectedDenomination={25} />);
        
//         const selectedButton = screen.getByText('$25');
//         expect(selectedButton).toHaveClass('selected');
//     });

//     it('calls onSelect when a chip is clicked', () => {
//         render(<ChipSelector {...defaultProps} />);
        
//         fireEvent.click(screen.getByText('$25'));
//         expect(defaultProps.onSelect).toHaveBeenCalledWith(25);
//     });

//     it('calls onClickOutside when clicking outside the component', () => {
//         render(
//             <div>
//                 <ChipSelector {...defaultProps} />
//                 <div data-testid="outside">Outside Element</div>
//             </div>
//         );
        
//         // Click outside the chip selector
//         fireEvent.mouseDown(screen.getByTestId('outside'));
//         expect(defaultProps.onClickOutside).toHaveBeenCalled();
//     });

// });