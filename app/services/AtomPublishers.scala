package services

import com.gu.atom.publish.{AtomPublisher, PreviewKinesisAtomPublisher, LiveKinesisAtomPublisher}
import com.gu.contentatom.thrift.{ContentAtomEvent, EventType, Atom}
import config.Config._
import models.{KinesisPublishingFailed, AtomAPIError}
import org.joda.time.DateTime
import play.api.Logger

import scala.util.{Failure, Success}

object AtomPublishers {
  val liveAtomPublisher = new LiveKinesisAtomPublisher(liveKinesisStreamName, kinesisClient)
  val previewAtomPublisher = new PreviewKinesisAtomPublisher(previewKinesisStreamName, kinesisClient)


  def sendKinesisEvent(atom: Atom, atomPublisher: AtomPublisher, eventType: EventType): Either[AtomAPIError, Unit] = {
    if (kinesisEnabled) {
      val event = ContentAtomEvent(atom, eventType, DateTime.now.getMillis)
      atomPublisher.publishAtomEvent(event) match {
        case Success(_) =>
          Logger.info(s"Successfully published ${atom.id} to kinesis with $eventType")
          Right(())
        case Failure(err) =>
          Logger.error(s"Failed to publish ${atom.id} to kinesis with $eventType", err)
          Left(KinesisPublishingFailed)
      }
    } else {
      Right(())
    }
  }
}
