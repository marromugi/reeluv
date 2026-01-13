import type { VideoDefinition } from '../../shared/valueObject/VideoDefinition'
import type { VideoStandard } from '../../shared/valueObject/VideoStandard'
import type { ShowReel } from '../entity/ShowReel'
import type { ShowReelId } from '../valueObject/ShowReelId'

/**
 * ShowReelリポジトリインターフェース
 * データアクセス層の抽象化
 */
export interface ShowReelRepository {
  /**
   * IDでShowReelを取得
   * @param id ShowReelのID
   * @returns ShowReel または存在しない場合はnull
   */
  findById(id: ShowReelId): Promise<ShowReel | null>

  /**
   * 全てのShowReelを取得
   * @returns 全ShowReelの配列
   */
  findAll(): Promise<ShowReel[]>

  /**
   * 指定された規格と解像度のShowReelを検索
   * @param standard ビデオ規格
   * @param definition ビデオ解像度
   * @returns 条件に合致するShowReelの配列
   */
  findByStandardAndDefinition(
    standard: VideoStandard,
    definition: VideoDefinition
  ): Promise<ShowReel[]>

  /**
   * ShowReelを保存（新規作成・更新）
   * @param showReel 保存するShowReel
   */
  save(showReel: ShowReel): Promise<void>

  /**
   * ShowReelを削除
   * @param id 削除するShowReelのID
   */
  delete(id: ShowReelId): Promise<void>

  /**
   * IDの存在確認
   * @param id ShowReelのID
   * @returns 存在すればtrue
   */
  exists(id: ShowReelId): Promise<boolean>
}
