import PropTypes from 'prop-types';

const CustomButton = ({ variant, timeframe, currentTimeframe, children, ...props }) => {
    const baseStyles = 'px-3 py-1 rounded-md focus:outline-none';
    const primaryStyles = ' border border-1 border-transparent hover:border-[#4B40EE] hover:border-1';
    const secondaryStyles = 'bg-[green]';

    const isActive = currentTimeframe === timeframe;
    const activeStyles = isActive ? 'bg-[#4B40EE] text-white' : 'text-black';

    const variantStyles = variant === 'primary' ? 
        `${primaryStyles} ${activeStyles}` : 
        secondaryStyles;

    return (
        <button className={`${baseStyles} ${variantStyles}`} {...props}>
            {children}
        </button>
    );
};

CustomButton.propTypes = {
    variant: PropTypes.oneOf(['primary', 'secondary']),
    timeframe: PropTypes.oneOf(['1d', '3d', '1w', '1m', '6m', '1y', 'max']),
    currentTimeframe: PropTypes.oneOf(['1d', '3d', '1w', '1m', '6m', '1y', 'max']),
    children: PropTypes.node.isRequired,
};

CustomButton.defaultProps = {
    variant: 'primary',
};

export default CustomButton;
