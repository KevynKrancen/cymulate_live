export const getRowStyle = (status: string) => {
    const baseStyle = { color: 'black' };
    switch (status.toLowerCase()) {
      case 'created':
        return { ...baseStyle, backgroundColor: '#e8f5f9' }; // Light green
      case 'failed':
        return { ...baseStyle, backgroundColor: '#ffebfe' }; // Light red
      case 'pending':
        return { ...baseStyle, backgroundColor: '#fff3f0' }; // Light orange
      default:
        return baseStyle;
    }
  };