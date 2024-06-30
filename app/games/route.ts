import { Game, dataFetcher } from '@/lib/data/data-fetcher';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let game: Game;
  try {
    const body = await request.json();
    game = body.game;
    if (!game) {
      throw new Error('Missing game in request body');
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error parsing request body' },
      { status: 400 }
    );
  }
  const gameData = await dataFetcher.fetch(game);
  return NextResponse.json(
    {
      gameData,
    },
    { status: 200 }
  );
}
