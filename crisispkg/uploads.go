package crisis

import (
	"net/http"
	"io"
	"os"
	"mime/multipart"
	"context"

	"cloud.google.com/go/storage"
	"gopkg.in/pg.v3"
)

const (
	BUCKET_NAME_ENV = "CLOUD_BUCKET_NAME"
)

func init() {
	http.HandleFunc("/uploadBG", func(w http.ResponseWriter, r *http.Request) {
		GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
			uuid := getCrisisUUID(tx, r)
			file, _, err := r.FormFile("background"); maybePanic(err)
			return store(file, uuid + "-bg.png")
		})
	})

	http.HandleFunc("/uploadTypeIcon", func(w http.ResponseWriter, r *http.Request) {
		GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
			uuid := getCrisisUUID(tx, r)
			file, _, err := r.FormFile("icon"); maybePanic(err)
			val := r.FormValue(`type-id`)
			return store(file, uuid + "-type" + val + ".png")
		})
	})

	http.HandleFunc("/uploadDivisionIcon", func(w http.ResponseWriter, r *http.Request) {
		GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
			uuid := getCrisisUUID(tx, r)
			file, _, err := r.FormFile("icon"); maybePanic(err)
			val := r.FormValue(`div-id`)
			return store(file, uuid + "-div" + val + ".png")
		})
	})
}

func getCrisisUUID(tx *pg.Tx, r *http.Request) string {
	auth, err := AuthInfoOf(tx, r); maybePanic(err)
	crisis, err := GetCrisisById(tx, auth.CrisisId); maybePanic(err)
	return crisis.UUID
}

func store(f multipart.File, name string) error {
	ctx := context.Background()

	client, err := storage.NewClient(ctx); maybePanic(err)
	bucket := client.Bucket(os.Getenv(BUCKET_NAME_ENV))
	obj := bucket.Object(name)

	w := obj.NewWriter(ctx)
	defer w.Close()

	_, err = io.Copy(w, f); maybePanic(err)
	err = w.Close(); maybePanic(err)

	return obj.ACL().Set(ctx, storage.AllUsers, storage.RoleReader)
}
