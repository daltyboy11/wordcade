import { Game, dataFetcher } from '@/lib/data/data-fetcher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let game: Game;
  let history: string[];
  try {
    const body = await request.json();
    game = body.game;
    history = body.history;
    if (!game) throw new Error('Missing game type in request body');
    if (!history) throw new Error('Missing responses array in request body');
  } catch (error) {
    return NextResponse.json(
      { message: 'Error parsing request body' },
      { status: 400 }
    );
  }
  const gameData = await dataFetcher.fetch(game, history);
  return NextResponse.json(
    {
      gameData,
    },
    { status: 200 }
  );
}
