import { ShowBallsProps } from './types';

function ShowBalls({ score, difficulty }: ShowBallsProps) {
  const balls = [];
  // Add filled poke balls based on the score
  for (let i = 0; i < score; i++) {
    balls.push(
      <img
        key={`filled-${i}`}
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
        alt="Poké Ball"
        className="h-6 w-6 md:h-10 md:w-10 mx-1"
      />
    );
  }

  // Add empty poke balls based on the remaining difficulty
  for (let i = score; i < difficulty; i++) {
    balls.push(
      <img
        key={`empty-${i}`}
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
        alt="Empty Poké Ball"
        className="h-6 w-6 md:h-10 md:w-10 mx-1 grayscale"
      />
    );
  }

  return <div className="flex justify-center flex-wrap max-w-60 ">{balls}</div>;
}

export default ShowBalls;
