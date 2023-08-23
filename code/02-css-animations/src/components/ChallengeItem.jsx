import { useContext } from 'react';

import { ChallengesContext } from '../store/challenges-context.jsx';

export default function ChallengeItem({
  challenge,
  onViewDetails,
  isExpanded,
}) {
  const { updateChallengeStatus } = useContext(ChallengesContext);

  const formattedDate = new Date(challenge.deadline).toLocaleDateString(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );

  function handleCancel() {
    updateChallengeStatus(challenge.id, 'failed');
  }

  function handleComplete() {
    updateChallengeStatus(challenge.id, 'completed');
  }

  return (
    <li>
      <article className="challenge-item">
        <header>
          <img {...challenge.image} />
          <div className="challenge-item-meta">
            <h2>{challenge.title}</h2>
            <p>Complete until {formattedDate}</p>
            <p className="challenge-item-actions">
              <button onClick={handleCancel} className="btn-negative">
                Mark as failed
              </button>
              <button onClick={handleComplete}>Mark as completed</button>
            </p>
          </div>
        </header>
        <div className={`challenge-item-details ${isExpanded ? 'expanded' : ''}`}>
          <p>
            <button onClick={onViewDetails}>
              View Details{' '}
              <span className="challenge-item-details-icon">&#9650;</span>
            </button>
          </p>

          {isExpanded && (
            <div>
              <p className="challenge-item-description">
                {challenge.description}
              </p>
            </div>
          )}
        </div>
      </article>
    </li>
  );
}
