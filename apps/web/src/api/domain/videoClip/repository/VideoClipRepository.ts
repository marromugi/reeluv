import type { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import type { VideoStandard } from '../../shared/valueObject/VideoStandard'
import type { VideoClip } from '../entity/VideoClip'
import type { VideoClipId } from '../valueObject/VideoClipId'

/**
 * VideoClipリポジトリインターフェース
 * データアクセス層の抽象化
 */
export interface VideoClipRepository {
  /**
   * IDでVideoClipを取得
   * @param id VideoClipのID
   * @returns VideoClip または存在しない場合はnull
   */
  findById(id: VideoClipId): Promise<VideoClip | null>

  /**
   * 複数のIDでVideoClipを一括取得
   * @param ids VideoClipのID配列
   * @returns 見つかったVideoClipの配列（順序は保証されない）
   */
  findByIds(ids: VideoClipId[]): Promise<VideoClip[]>

  /**
   * 全てのVideoClipを取得
   * @returns 全VideoClipの配列
   */
  findAll(): Promise<VideoClip[]>

  /**
   * 指定された規格と解像度に互換性のあるクリップを検索
   * @param standard ビデオ規格
   * @param definition ビデオ解像度
   * @returns 互換性のあるVideoClipの配列
   */
  findCompatible(
    standard: VideoStandard,
    definition: VideoDefinition
  ): Promise<VideoClip[]>

  /**
   * VideoClipを保存（新規作成・更新）
   * @param videoClip 保存するVideoClip
   */
  save(videoClip: VideoClip): Promise<void>

  /**
   * VideoClipを削除
   * @param id 削除するVideoClipのID
   */
  delete(id: VideoClipId): Promise<void>

  /**
   * IDの存在確認
   * @param id VideoClipのID
   * @returns 存在すればtrue
   */
  exists(id: VideoClipId): Promise<boolean>
}
