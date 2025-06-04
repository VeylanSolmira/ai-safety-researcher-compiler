import { NextRequest, NextResponse } from 'next/server';
import { getExperiment } from '@/lib/db/experiments-queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { experimentId: string } }
) {
  try {
    const experiment = getExperiment(params.experimentId);
    
    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(experiment);
  } catch (error) {
    console.error('Error fetching experiment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiment' },
      { status: 500 }
    );
  }
}