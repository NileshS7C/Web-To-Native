import React, { useEffect } from 'react'
import { useGetFixtureId, useGetTournamentStanding } from '../../Hooks/tournamentStandingHooks'
const TournamentStandings = ({ tournamentId, categoryId }) => {  
  const {
    data: fixtureData,
    isLoading: isFixtureLoading,
    isError: isFixtureError,
  } = useGetFixtureId({
    tournamentId,
    categoryId
  });
  const fixtureID = fixtureData
  const {
    data: standingData,
    isLoading: isStandingLoading,
    isError: isStandingError,
  } = useGetTournamentStanding({
    tournamentId,
    categoryId,
    fixtureId: fixtureID
  });

  const standing = standingData  
  if (isFixtureLoading || isStandingLoading) {
    return (
      <div>
        <div className='w-full h-[200px] animate-pulse rounded-md bg-gray-200'>
        </div>
      </div>
    )
  }

  if (isFixtureError) {
    return <div>No fixture exists for this category</div>
  }

  if (isStandingError) {
    return <div>Error loading standings.</div>
  }

  if (!standing || !standing.groups || standing.groups.length === 0) { 
    return <div>No standings available.</div>
  }


  return (
    <div>
      <div>
      {standing.groups.map((group, groupIdx) => {
          const hasPointDifference = group.standings.some(player => player.pointDifference !== undefined && player.pointDifference !== null);

          return (
            <div key={group.groupId} className="mb-8">
              <h2 className="text-lg font-bold mb-4">{`Group ${groupIdx + 1}`}</h2>

              {/* Table for md and up */}
              <table className="w-full border-collapse hidden md:table border border-gray-300 mb-4">
                <thead>
                  <tr className='bg-white'>
                    <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Rank</th>
                    <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Player Name</th>
                    <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">P</th>
                    <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">W</th>
                    <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">L</th>
                    {hasPointDifference && (
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">PD</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {group.standings.map((player, index) => (
                    <tr key={player.id} className={`${index % 2 === 0 ? 'bg-blue-100' : ''}`}>
                      <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.rank}</td>
                      <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.name}</td>
                      <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.matchesPlayed}</td>
                      <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.matchesWon}</td>
                      <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.matchesLost}</td>
                      {hasPointDifference && (
                        <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">
                          {player.pointDifference !== undefined && player.pointDifference !== null
                            ? player.pointDifference > 0
                              ? `+${player.pointDifference}`
                              : player.pointDifference
                            : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cards for mobile */}
              <div className="flex flex-col gap-4 md:hidden">
                {group.standings.map((player) => (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm" key={player.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Rank:</span>
                      <span>{player.rank}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Player Name:</span>
                      <span>{player.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Matches Played:</span>
                      <span>{player.matchesPlayed}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Won:</span>
                      <span>{player.matchesWon}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Lost:</span>
                      <span>{player.matchesLost}</span>
                    </div>
                    {hasPointDifference && (
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">PD:</span>
                        <span>
                          {player.pointDifference !== undefined && player.pointDifference !== null
                            ? player.pointDifference > 0
                              ? `+${player.pointDifference}`
                              : player.pointDifference
                            : '-'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default TournamentStandings