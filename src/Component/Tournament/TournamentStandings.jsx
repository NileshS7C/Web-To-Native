import React, { useEffect } from 'react'
import { useGetFixtureId, useGetTournamentStanding } from '../../Hooks/tournamentStandingHooks'
import { nanoid } from '@reduxjs/toolkit'

const TournamentStandings = ({ tournamentId, categoryId }) => {  
  const { data: fixtureID, isLoading: isFixtureLoading, isError: isFixtureError } = useGetFixtureId({ tournamentId, categoryId })
  const { data: standing, isLoading: isStandingLoading, isError: isStandingError } = useGetTournamentStanding({ tournamentId, categoryId, fixtureId: fixtureID })

  useEffect(() => {
    console.log(standing,'stanidng')
  },[standing])
  
  if (isFixtureLoading || isStandingLoading) {
    return (
      <div>
        <div className='w-full h-[200px] animate-pulse rounded-md bg-gray-200'>
          
        </div>
      </div>
    )
  }

  if (isFixtureError) {
    return <div>Error loading fixture ID.</div>
  }

  if (isStandingError) {
    return <div>Error loading standings.</div>
  }

    if (!standing || !standing.groups || standing.groups === 0) {
      return <div>No standings available.</div>
    }


  return (
    <div>
      <div>
        {standing && standing.groups && standing.groups.length > 0 ? (
          <>
            {standing.groups.map((group, groupIdx) => (
              <div key={group.groupId} className="mb-8">
                <h2 className="text-lg font-bold mb-4">{`Group ${groupIdx + 1}`}</h2>
                {/* Table for md and up */}
                <table className="w-full border-collapse hidden md:table border border-gray-300 mb-4">
                  <thead>
                    <tr className='bg-white'>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Rank</th>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Player Name</th>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Matches Played</th>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Won</th>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Lost</th>
                      <th className="border-y border-gray-300 px-3 py-2 font-medium opacity-80">Points</th>
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
                        <td className="border-y border-gray-300 px-3 py-2 text-center opacity-85">{player.points}</td>
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
                      <div className="flex justify-between">
                        <span className="font-semibold">Points:</span>
                        <span>{player.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>No standings available.</div>
        )}
      </div>
    </div>
  )
}

export default TournamentStandings