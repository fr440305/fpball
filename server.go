package main

import "fmt"
import "net/http"

func main() {
	fmt.Println("vim-go")
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.ListenAndServe(":8080", nil)
}
