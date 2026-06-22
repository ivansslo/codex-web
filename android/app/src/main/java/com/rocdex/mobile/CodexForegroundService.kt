package com.rocdex.mobile

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

class CodexForegroundService : Service() {

    companion object {
        private const val CHANNEL_ID = "codex_running"
        private const val NOTIFICATION_ID = 1
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent != null) {
            val localUrl = intent.getStringExtra("local_url") ?: "http://127.0.0.1:18923"
            val networkUrl = intent.getStringExtra("network_url") ?: ""
            val port = intent.getStringExtra("port") ?: "18923"
            val password = intent.getStringExtra("password") ?: ""

            val notification = buildNotification(
                contentText = "Running at $localUrl",
                subText = if (networkUrl.isNotEmpty()) "Network: $networkUrl" else null
            )

            val manager = getSystemService(NotificationManager::class.java)
            manager.notify(NOTIFICATION_ID, notification)
        }

        // Update existing notification
        return START_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Codex Web Local",
                NotificationManager.IMPORTANCE_LOW,
            ).apply {
                description = "Codex Web Local server is running"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(
        contentText: String = "Server running in background",
        subText: String? = null,
    ): Notification {
        val launchIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            this, 0, launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("Codex Web Local")
            .setContentText(contentText)
            .setSubText(subText)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }
}
