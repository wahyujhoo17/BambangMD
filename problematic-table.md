# Test Problematic Table

## Form Status States 1

| Status           | Deskripsi                                              | Dapat Diakses Oleh            |
| ---------------- | ------------------------------------------------------ | ----------------------------- |
| `draft`          | Form baru dibuat, belum disubmit untuk approval        | Creator, Superadmin           |
| `open`           | Form telah disubmit dan menunggu approval step pertama | Creator, Approver, Superadmin |
| `in_approval`    | Form sedang dalam proses approval (step 2+)            | Creator, Approver, Superadmin |
| `approved`       | Form telah diapprove semua step, siap untuk payment    | Creator, Finance, Superadmin  |
| `rejected`       | Form ditolak dan perlu revisi                          | Creator, Superadmin           |
| `partially_paid` | Form sebagian sudah dibayar                            | Creator, Finance, Superadmin  |
| `paid`           | Form sudah dibayar penuh                               | Creator, Finance, Superadmin  |
| `closed`         | Form telah ditutup/selesai                             | Semua user (view only)        |

## Form Status States 2

| Status | Deskripsi | Dapat Diakses Oleh |

| ---------------- | ------------------------------------------------------ | ----------------------------- |

| `draft` | Form baru dibuat, belum disubmit untuk approval | Creator, Superadmin |

| `open` | Form telah disubmit dan menunggu approval step pertama | Creator, Approver, Superadmin |

| `in_approval` | Form sedang dalam proses approval (step 2+) | Creator, Approver, Superadmin |

| `approved` | Form telah diapprove semua step, siap untuk payment | Creator, Finance, Superadmin |

| `rejected` | Form ditolak dan perlu revisi | Creator, Superadmin |

| `partially_paid` | Form sebagian sudah dibayar | Creator, Finance, Superadmin |

| `paid` | Form sudah dibayar penuh | Creator, Finance, Superadmin |

| `closed` | Form telah ditutup/selesai | Semua user (view only) |
