import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import { CHALLENGES, getChallengeById } from '../features/challenges/data/challengesData';
import ChallengeCard from '../features/challenges/components/ChallengeCard';
import ChallengeWorkbench from '../features/challenges/components/ChallengeWorkbench';
import {
  getCompletedChallenges,
  isChallengeCompleted,
  clearAllChallengeProgress
} from '../features/challenges/utils/progressStorage';

const Challenges = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedChallengeId = searchParams.get('id');

  // Completed challenges map: { [challengeId]: { completed: true, completedAt: string, attempts: number } }
  const [completedMap, setCompletedMap] = useState(() => getCompletedChallenges());

  const refreshProgress = useCallback(() => {
    setCompletedMap(getCompletedChallenges());
  }, []);

  // Active challenge object
  const activeChallenge = selectedChallengeId ? getChallengeById(selectedChallengeId) : null;

  const handleOpenChallenge = (challengeId) => {
    setSearchParams({ id: challengeId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setSearchParams({});
    refreshProgress();
  };

  const handleNavigateChallenge = (challengeId) => {
    setSearchParams({ id: challengeId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = CHALLENGES.filter(c => completedMap[c.id]?.completed).length;
  const totalCount = CHALLENGES.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="container" style={{ paddingBottom: '5rem', maxWidth: '1400px' }}>
      
      {activeChallenge ? (
        // Challenge Workbench View
        <ChallengeWorkbench
          key={activeChallenge.id}
          challenge={activeChallenge}
          isCompleted={Boolean(completedMap[activeChallenge.id]?.completed)}
          completedData={completedMap[activeChallenge.id]}
          onBack={handleBackToOverview}
          onNavigateChallenge={handleNavigateChallenge}
          onProgressUpdated={refreshProgress}
        />
      ) : (
        // Challenges Overview View
        <div>
          <FadeIn direction="down" distance="20px">
            <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '2rem' }}>
              <div className="tech-label text-blue" style={{ marginBottom: '1rem', letterSpacing: '0.2em' }}>
                KNOWLEDGE VERIFICATION
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em' }}>
                    Challenges
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.1rem', maxWidth: '650px', lineHeight: 1.6 }}>
                    Construct and verify real quantum circuits against physical target states. Your circuits are executed directly on the Qiskit backend simulation engine and evaluated across statevector fidelity, relative phase, and entanglement.
                  </p>
                </div>

                {/* Progress Telemetry Card */}
                <div
                  className="sci-panel"
                  style={{
                    padding: '1.5rem 2rem',
                    backgroundColor: 'var(--bg-panel)',
                    minWidth: '240px',
                    borderColor: completedCount === totalCount ? 'var(--accent-green)' : 'var(--border-light)'
                  }}
                >
                  <div className="tech-label" style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                    VERIFICATION PROGRESS
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="text-mono" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: completedCount === totalCount ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
                      {completedCount}
                    </span>
                    <span className="text-mono" style={{ fontSize: '1.3rem', color: 'var(--text-dim)' }}>
                      / {totalCount} COMPLETED
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-light)', marginTop: '0.8rem', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: completedCount === totalCount ? 'var(--accent-green)' : 'var(--accent-blue)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Grid of 4 Responsive Challenge Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '2rem' }}>
            {CHALLENGES.map((challenge) => {
              const isCompleted = isChallengeCompleted(challenge.id);
              return (
                <FadeIn key={challenge.id} direction="up" distance="15px">
                  <ChallengeCard
                    challenge={challenge}
                    isCompleted={isCompleted}
                    completedData={completedMap[challenge.id]}
                    onOpen={handleOpenChallenge}
                  />
                </FadeIn>
              );
            })}
          </div>

          {/* Bottom Telemetry & Reset Option */}
          {completedCount > 0 && (
            <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all challenge completion data?')) {
                    clearAllChallengeProgress();
                    refreshProgress();
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-dim)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-red)';
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-dim)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                RESET ALL CHALLENGE PROGRESS ↺
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Challenges;
