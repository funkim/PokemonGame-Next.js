import { ShowBallsProps } from './types';

function ShowBalls({ score, difficulty }: ShowBallsProps) {
  const balls = [];
  // Add filled poke balls based on the score
  for (let i = 0; i < score; i++) {
    balls.push(
      <img
        key={`filled-${i}`}
        src="https://p1.hiclipart.com/preview/742/695/612/pokeball-pokeball-illustraion-png-clipart.jpg"
        alt="Poké Ball"
        style={{ width: '50px', height: '50px', margin: '5px' }}
      />
    );
  }
  // Add empty poke balls based on the remaining difficulty
  for (let i = score; i < difficulty; i++) {
    balls.push(
      <img key={`empty-${i}`} src="https://p1.hiclipart.com/preview/742/695/612/pokeball-pokeball-illustraion-png-clipart.jpg" alt="Poké Ball" />
    );
  }

  return <div className="bg">{balls}</div>;
}

export default ShowBalls;
