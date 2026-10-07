import CoreStateVisualizer from './CoreStateVisualizer';

const STATE_MAP = {
  '|0⟩': { prob0: 100, prob1: 0, title: '|0⟩', desc: 'Deterministic State 0' },
  '|1⟩': { prob0: 0, prob1: 100, title: '|1⟩', desc: 'Deterministic State 1' },
  '|+⟩': { prob0: 50, prob1: 50, title: '|+⟩', desc: 'Equal Superposition' },
  '|-⟩': { prob0: 50, prob1: 50, title: '|-⟩', desc: 'Equal Superposition (Phase π)' },
  '|i⟩': { prob0: 50, prob1: 50, title: '|i⟩', desc: 'Equal Superposition (Phase π/2)' },
  '|-i⟩': { prob0: 50, prob1: 50, title: '|-i⟩', desc: 'Equal Superposition (Phase -π/2)' },
};

const LessonStateVisualizer = ({ stateName }) => {
  const { prob0, prob1, title, desc } = STATE_MAP[stateName] || STATE_MAP['|0⟩'];

  const basisStates = [
    { label: '|0⟩', probability: prob0 },
    { label: '|1⟩', probability: prob1 }
  ];

  return (
    <CoreStateVisualizer
      title={title}
      desc={desc}
      basisStates={basisStates}
    />
  );
};

export default LessonStateVisualizer;
