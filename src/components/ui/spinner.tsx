const Spinner = ({ size = 1 }: { size?: number }) => {
  return <div className="spinner" style={{ scale: `${size}` }}></div>;
};

export default Spinner;
