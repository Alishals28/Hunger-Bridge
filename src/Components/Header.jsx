import './Header.css'

const Header = ({ title ,imageSrc}) => {
  return (
    <div className="header-container"
      style={{ backgroundImage: `url(${imageSrc})` }}>
      <h1 className="header-title">{title}</h1>
    </div>
  );
};

export default Header;
