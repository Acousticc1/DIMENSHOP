/**
 * Processing Job domain entity
 * Represents a 3D model generation job in the COLMAP pipeline
 */

export type ProcessingJobStatus =
  | 'queued'
  | 'downloading'
  | 'reconstructing'
  | 'meshing'
  | 'optimizing'
  | 'exporting'
  | 'completed'
  | 'failed';

export interface ProcessingJob {
  readonly id: string;
  readonly productId: string;
  readonly sellerId: string;
  readonly status: ProcessingJobStatus;
  readonly progress: number;
  readonly errorMessage: string | null;
  readonly modelUrl: string | null;
  readonly pipelineMetadata: Record<string, unknown> | null;
  readonly startedAt: Date | null;
  readonly completedAt: Date | null;
  readonly createdAt: Date;
}
