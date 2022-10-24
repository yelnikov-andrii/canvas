type Props = {
  clear: () => void;
}

export const Button: React.FC <Props> = ({clear}) => {
  return (
    <div className="App__button">
      <button className="button" onClick={() => {
        clear();
      }}>
        Clear
      </button>
    </div>
  )
}